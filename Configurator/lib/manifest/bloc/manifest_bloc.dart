import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:mayday_configurator/manifest/models/manifest_deployment.dart';
import 'package:mayday_configurator/manifest/repository/manifest_repository.dart';

part 'manifest_event.dart';
part 'manifest_state.dart';

class ManifestBloc extends Bloc<ManifestEvent, ManifestState> {
  ManifestBloc({
    required ManifestRepository manifestRepository,
  })  : _manifestRepository = manifestRepository,
        super(const ManifestState()) {
    on<DeployManifestRequested>(_onDeployManifestRequested);
  }

  final ManifestRepository _manifestRepository;

  Future<void> _onDeployManifestRequested(
      DeployManifestRequested event,
      Emitter<ManifestState> emit,
      ) async {
    emit(state.copyWith(status: ManifestStatus.loading));
    try {
      final deployment = await _manifestRepository.deployManifest();
      if (deployment.isSuccess) {
        emit(
          state.copyWith(
            status: ManifestStatus.success,
            deployment: deployment,
          ),
        );
      } else {
        emit(
          state.copyWith(
            status: ManifestStatus.failure,
            errorMessage: deployment.error,
          ),
        );
      }
    } catch (e) {
      emit(
        state.copyWith(
          status: ManifestStatus.failure,
          errorMessage: e.toString(),
        ),
      );
    }
  }
}