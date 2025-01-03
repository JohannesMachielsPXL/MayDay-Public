import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mayday_configurator/manifest/bloc/manifest_bloc.dart';
import 'package:mayday_configurator/manifest/view/widgets/deployment_status_widget.dart';

class ManifestPage extends StatelessWidget {
  const ManifestPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => ManifestBloc(
        manifestRepository: context.read(),
      ),
      child: const ManifestView(),
    );
  }
}

class ManifestView extends StatelessWidget {
  const ManifestView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Word Add-in Deployer'),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const DeploymentStatusWidget(),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () {
                  context
                      .read<ManifestBloc>()
                      .add(const DeployManifestRequested());
                },
                child: const Text('Deploy Manifest'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}