import 'dart:ffi';
import 'dart:io';
import 'package:ffi/ffi.dart';
import 'package:win32/win32.dart';
import 'package:path_provider/path_provider.dart';
import 'models/shared_folder_info.dart';

class SharedFolderService {
  bool _isElevated = false;

  Future<bool> checkAdminPrivileges() async {
    if (!Platform.isWindows) return true;

    try {
      // Check if running as administrator using PowerShell
      final result = await Process.run('powershell', [
        '-Command',
        '[Security.Principal.WindowsIdentity]::GetCurrent().Groups -contains '
            "'S-1-5-32-544'"
      ]);

      if (result.exitCode == 0 && result.stdout.toString().trim() == 'True') {
        _isElevated = true;
        return true;
      }

      // Fall back to token elevation check if PowerShell check fails
      final token = calloc<HANDLE>();
      final elevation = calloc<DWORD>();
      final size = calloc<DWORD>();

      try {
        if (OpenProcessToken(GetCurrentProcess(), TOKEN_QUERY, token) != 0) {
          if (GetTokenInformation(
            token.value,
            TOKEN_INFORMATION_CLASS.TokenElevation,
            elevation,
            sizeOf<DWORD>(),
            size,
          ) != 0) {
            _isElevated = elevation.value != 0;
          }
        }

        return _isElevated;
      } finally {
        free(token);
        free(elevation);
        free(size);
      }
    } catch (e) {
      return false;
    }
  }

  Future<String> createSharedFolder() async {
    if (Platform.isWindows && !await checkAdminPrivileges()) {
      throw Exception(
        'Administrative privileges required. Please run the application as administrator.',
      );
    }

    try {
      if (Platform.isWindows) {
        return await _createWindowsSharedFolder();
      } else {
        throw UnsupportedError('Unsupported platform');
      }
    } catch (e) {
      throw Exception('Failed to create shared folder: $e');
    }
  }

  Future<String> _createWindowsSharedFolder() async {
    try {
      // Get computer name
      final computerNameResult = await Process.run('hostname', []);
      final computerName = computerNameResult.stdout.toString().trim();

      // Get current username
      final userNameResult = await Process.run('whoami', []);
      final fullUsername = userNameResult.stdout.toString().trim();
      final username = fullUsername.split('\\').last.trim();

      // Create the physical folder
      final folderPath = 'C:\\Users\\$username\\WordAddin Shared Folder';
      final directory = Directory(folderPath);

      if (!await directory.exists()) {
        await directory.create(recursive: true);
      }

      // First, ensure any existing share is removed
      await Process.run('powershell', [
        '-Command',
        'Remove-SmbShare -Name "WordAddinShare" -Force -ErrorAction SilentlyContinue'
      ]);

      // Wait a moment for the share removal to complete
      await Future.delayed(const Duration(seconds: 1));

      // Create the share with proper permissions
      final shareCommand = '''
        \$SharePath = '$folderPath'
        \$ShareName = 'WordAddinShare'
        
        # Create new share
        New-SmbShare -Name \$ShareName -Path \$SharePath -FullAccess Everyone
        
        # Set NTFS permissions
        \$Acl = Get-Acl \$SharePath
        \$AccessRule = New-Object System.Security.AccessControl.FileSystemAccessRule("Everyone","FullControl","ContainerInherit,ObjectInherit","None","Allow")
        \$Acl.SetAccessRule(\$AccessRule)
        Set-Acl \$SharePath \$Acl
        
        # Enable necessary firewall rules
        Enable-NetFirewallRule -DisplayGroup "File and Printer Sharing"
        Enable-NetFirewallRule -DisplayGroup "Network Discovery"
        ''';

      final result = await Process.run('powershell', ['-Command', shareCommand]);

      if (result.exitCode != 0) {
        throw Exception('Failed to create share: ${result.stderr}');
      }

      // Verify share exists using Get-SmbShare
      final verifyCommand = 'Get-SmbShare -Name "WordAddinShare" | Select-Object -ExpandProperty Name';
      final verifyResult = await Process.run('powershell', ['-Command', verifyCommand]);

      if (!verifyResult.stdout.toString().contains('WordAddinShare')) {
        throw Exception('Share creation failed - share not found');
      }

      final uncPath = '\\\\$computerName\\WordAddinShare';

      // Verify accessibility with multiple retries
      int maxRetries = 5;
      for (int i = 0; i < maxRetries; i++) {
        try {
          // Test write access
          final testFile = File('$uncPath\\test.txt');
          await testFile.writeAsString('test');
          await testFile.delete();
          return uncPath;
        } catch (e) {
          if (i == maxRetries - 1) {
            throw Exception('Cannot access share after multiple attempts');
          }
          await Future.delayed(Duration(seconds: 1));
        }
      }

      return uncPath;
    } catch (e) {
      throw Exception('Failed to create Windows shared folder: $e');
    }
  }

  Future<void> saveManifest(String sharePath, String manifestContent) async {
    try {
      // Convert UNC path to local path for Windows
      final String localPath = await _getLocalPathFromUNC(sharePath);
      final manifestFile = File('$localPath\\manifest.xml');
      await manifestFile.writeAsString(manifestContent);
    } catch (e) {
      throw Exception('Failed to save manifest: $e');
    }
  }

  Future<String> _getLocalPathFromUNC(String uncPath) async {
    if (Platform.isWindows) {
      // Get username
      final userNameResult = await Process.run('whoami', []);
      final fullUsername = userNameResult.stdout.toString().trim();
      final username = fullUsername.split('\\').last.trim();

      // Convert UNC path to local path
      return 'C:\\Users\\$username\\WordAddin Shared Folder';
    }
    return uncPath;
  }
}