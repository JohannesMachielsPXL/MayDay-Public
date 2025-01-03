import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mayday_configurator/manifest/repository/manifest_repository.dart';
import 'package:mayday_configurator/manifest/view/manifest_page.dart';
import 'package:mayday_configurator/shared_folder/shared_folder_service.dart';

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiRepositoryProvider(
      providers: [
        RepositoryProvider(
          create: (context) => SharedFolderService(),
        ),
        RepositoryProvider(
          create: (context) => ManifestRepository(
            sharedFolderService: context.read<SharedFolderService>(),
          ),
        ),
      ],
      child: const AppView(),
    );
  }
}

class AppView extends StatelessWidget {
  const AppView({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(
        appBarTheme: const AppBarTheme(color: Color(0xFF13B9FF)),
        colorScheme: ColorScheme.fromSwatch(
          accentColor: const Color(0xFF13B9FF),
        ),
      ),
      home: const ManifestPage(),
    );
  }
}
