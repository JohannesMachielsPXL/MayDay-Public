import 'package:equatable/equatable.dart';

class ManifestDeployment extends Equatable {
  const ManifestDeployment({
    required this.path,
    required this.isSuccess,
    this.error,
  });

  final String path;
  final bool isSuccess;
  final String? error;

  @override
  List<Object?> get props => [path, isSuccess, error];
}