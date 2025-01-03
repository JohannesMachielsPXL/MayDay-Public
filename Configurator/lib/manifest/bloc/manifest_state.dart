part of 'manifest_bloc.dart';

enum ManifestStatus { initial, loading, success, failure }

class ManifestState extends Equatable {
  const ManifestState({
    this.status = ManifestStatus.initial,
    this.deployment,
    this.errorMessage,
  });

  final ManifestStatus status;
  final ManifestDeployment? deployment;
  final String? errorMessage;

  ManifestState copyWith({
    ManifestStatus? status,
    ManifestDeployment? deployment,
    String? errorMessage,
  }) {
    return ManifestState(
      status: status ?? this.status,
      deployment: deployment ?? this.deployment,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }

  @override
  List<Object?> get props => [status, deployment, errorMessage];
}