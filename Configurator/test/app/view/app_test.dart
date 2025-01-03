import 'package:flutter_test/flutter_test.dart';
import 'package:mayday_configurator/app/app.dart';

void main() {
  group('App', () {
    testWidgets('renders AppView', (tester) async {
      await tester.pumpWidget(const App());
      expect(find.byType(AppView), findsOneWidget);
    });
  });
}
