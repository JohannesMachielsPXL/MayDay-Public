import 'package:equatable/equatable.dart';

class SharedFolderInfo extends Equatable {
  const SharedFolderInfo({
    required this.localPath,
    required this.uncPath,
    required this.shareName,
  });

  final String localPath;
  final String uncPath;
  final String shareName;

  @override
  List<Object> get props => [localPath, uncPath, shareName];
}