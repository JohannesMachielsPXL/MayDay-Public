import 'package:bloc_test/bloc_test.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mayday_configurator/manifest/bloc/manifest_bloc.dart';
import 'package:mayday_configurator/manifest/repository/manifest_repository.dart';
import 'package:mayday_configurator/manifest/view/manifest_page.dart';
import 'package:mocktail/mocktail.dart';

class MockManifestRepository extends Mock implements ManifestRepository {}
class MockManifestBloc extends MockBloc<ManifestEvent, ManifestState>
    implements ManifestBloc {}

void main() {
  group('ManifestPage', () {
    late ManifestRepository manifestRepository;

    setUp(() {
      manifestRepository = MockManifestRepository();
    });

    testWidgets('renders ManifestView', (tester) async {
      await tester.pumpWidget(
        RepositoryProvider.value(
          value: manifestRepository,
          child: const MaterialApp(
            home: ManifestPage(),
          ),
        ),
      );

      expect(find.byType(ManifestView), findsOneWidget);
    });

    testWidgets('shows deploy button', (tester) async {
      await tester.pumpWidget(
        RepositoryProvider.value(
          value: manifestRepository,
          child: const MaterialApp(
            home: ManifestPage(),
          ),
        ),
      );

      expect(find.text('Deploy Manifest'), findsOneWidget);
    });
  });
}