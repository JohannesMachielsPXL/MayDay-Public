import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../bloc/manifest_bloc.dart';

class DeploymentStatusWidget extends StatelessWidget {
  const DeploymentStatusWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ManifestBloc, ManifestState>(
      builder: (context, state) {
        return Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            border: Border.all(color: Colors.grey),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              _buildStatus(state),
              if (state.status == ManifestStatus.failure &&
                  state.errorMessage?.contains('Administrative privileges') == true)
                Padding(
                  padding: const EdgeInsets.only(top: 16),
                  child: ElevatedButton(
                    onPressed: () {
                      // Restart app with admin privileges
                      Process.run('powershell', [
                        'Start-Process',
                        '"${Platform.resolvedExecutable}"',
                        '-Verb',
                        'RunAs'
                      ]);
                      exit(0);
                    },
                    child: const Text('Restart as Administrator'),
                  ),
                ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildStatus(ManifestState state) {
    switch (state.status) {
      case ManifestStatus.initial:
        return const Text('Ready to deploy manifest');
      case ManifestStatus.loading:
        return const Column(
          children: [
            CircularProgressIndicator(),
            SizedBox(height: 10),
            Text('Deploying manifest...'),
          ],
        );
      case ManifestStatus.success:
        return Column(
          children: [
            const Icon(Icons.check_circle, color: Colors.green),
            const SizedBox(height: 10),
            Text('Deployed to: ${state.deployment?.path}'),
          ],
        );
      case ManifestStatus.failure:
        return Column(
          children: [
            const Icon(Icons.error, color: Colors.red),
            const SizedBox(height: 10),
            Text(
              state.errorMessage?.contains('Administrative privileges') == true
                  ? 'Administrator privileges required'
                  : 'Error: ${state.errorMessage}',
              textAlign: TextAlign.center,
            ),
          ],
        );
    }
  }
}