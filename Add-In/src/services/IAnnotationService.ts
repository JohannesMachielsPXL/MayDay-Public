export default interface IAnnotationService {
  highlightSelectedText(style: string): Promise<void>;

  insertFeedback(feedbackStyle: string, feedback: string, categoryRef: string): Promise<void>;

  removeHighlightFromSelectedText(): Promise<void>;
}
