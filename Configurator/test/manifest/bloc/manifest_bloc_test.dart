import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mayday_configurator/manifest/bloc/manifest_bloc.dart';
import 'package:mayday_configurator/manifest/models/manifest_deployment.dart';
import 'package:mayday_configurator/manifest/repository/manifest_repository.dart';
import 'package:mocktail/mocktail.dart';

class MockManifestRepository extends Mock implements ManifestRepository {}

void main() {
  group('ManifestBloc', () {
    late ManifestRepository manifestRepository;
    late ManifestBloc manifestBloc;

    setUp(() {
      manifestRepository = MockManifestRepository();
      manifestBloc = ManifestBloc(manifestRepository: manifestRepository);
    });

    tearDown(() {
      manifestBloc.close();
    });

    test('initial state is correct', () {
      expect(manifestBloc.state, const ManifestState());
    });

    blocTest<ManifestBloc, ManifestState>(
      'emits [loading, success] when deployment succeeds',
      setUp: () {
        when(() => manifestRepository.deployManifest()).thenAnswer(
              (_) async => const ManifestDeployment(
            path: 'test/path',
            isSuccess: true,
          ),
        );
      },
      build: () => manifestBloc,
      act: (bloc) => bloc.add(const DeployManifestRequested()),
      expect: () => [
        const ManifestState(status: ManifestStatus.loading),
        isA<ManifestState>()
            .having((s) => s.status, 'status', ManifestStatus.success)
            .having((s) => s.deployment?.path, 'path', 'test/path'),
      ],
    );
  });
}