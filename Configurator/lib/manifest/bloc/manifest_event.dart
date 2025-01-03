part of 'manifest_bloc.dart';

abstract class ManifestEvent extends Equatable {
  const ManifestEvent();

  @override
  List<Object?> get props => [];
}

class DeployManifestRequested extends ManifestEvent {
  const DeployManifestRequested();
}