import 'package:flutter/services.dart';
import 'package:mayday_configurator/manifest/models/manifest_deployment.dart';
import 'package:mayday_configurator/shared_folder/shared_folder_service.dart';

class ManifestRepository {
  ManifestRepository({
    required SharedFolderService sharedFolderService,
  }) : _sharedFolderService = sharedFolderService;

  final SharedFolderService _sharedFolderService;

  Future<ManifestDeployment> deployManifest() async {
    try {
      final sharedPath = await _sharedFolderService.createSharedFolder();
      final manifestContent = await rootBundle.loadString('assets/manifest.xml');
      await _sharedFolderService.saveManifest(sharedPath, manifestContent);

      return ManifestDeployment(
        path: sharedPath,
        isSuccess: true,
      );
    } catch (e) {
      return ManifestDeployment(
        path: '',
        isSuccess: false,
        error: e.toString(),
      );
    }
  }
}