import AnnotationService from '../../src/services/implementations/AnnotationService';
import StyleService from '../../src/services/implementations/StyleService';
import ICategory from '../../src/models/ICategory';
//import { mock } from 'jest-mock-extended';

describe('AnnotationService', () => {
  let service: AnnotationService;
  let mockContext: any;
  let mockStyles: any;
  let mockSelection: any;

  beforeEach(() => {
    mockSelection = {
      insertText: jest.fn(),
      style: null
    };

    mockStyles = {
      getByNameOrNullObject: jest.fn(),
      load: jest.fn()
    };

    mockContext = {
      document: {
        getSelection: jest.fn().mockReturnValue(mockSelection),
        getStyles: jest.fn().mockReturnValue(mockStyles)
      },
      sync: jest.fn()
    };

    (global as any).Word = {
      run: jest.fn((callback) => callback(mockContext))
    };

    service = new AnnotationService();
  });

  describe('insertFeedback', () => {
    it('should insert feedback with correct style when style exists', async () => {
      const feedbackStyle = { isNullObject: false, load: jest.fn() };
      mockStyles.getByNameOrNullObject.mockReturnValue(feedbackStyle);

      await service.insertFeedback('TestStyle', 'Test feedback', 'abc');

      expect(mockStyles.load).toHaveBeenCalledWith('getByNameOrNullObject');
      expect(mockStyles.getByNameOrNullObject).toHaveBeenCalledWith('TestStyle');
      expect(feedbackStyle.load).toHaveBeenCalledWith('isNullObject');
      expect(mockSelection.insertText).toHaveBeenCalledWith('[abc] Test feedback', 'After');
      expect(mockContext.sync).toHaveBeenCalledTimes(2);
    });
it('should not insert feedback when style does not exist', async () => {
      const feedbackStyle = { isNullObject: true, load: jest.fn() };
      mockStyles.getByNameOrNullObject.mockReturnValue(feedbackStyle);

      await service.insertFeedback('NonexistentStyle', 'Test feedback', 'abc');

      expect(mockSelection.insertText).not.toHaveBeenCalled();
    });

    it('should handle errors appropriately', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      const error = new Error('Test error');
      (global as any).Word.run.mockImplementation(() => Promise.reject(error));

      await service.insertFeedback('TestStyle', 'Test feedback', 'abc');

      expect(consoleError).toHaveBeenCalledWith(error);
      consoleError.mockRestore();
    });
  });

  describe('highlightSelectedText', () => {
    it('should highlight selected text with correct style when style exists', async () => {
      const highlightStyle = {isNullObject: false, load: jest.fn()};
      mockStyles.getByNameOrNullObject.mockReturnValue(highlightStyle);

      await service.highlightSelectedText('TestStyle');

      expect(mockStyles.load).toHaveBeenCalledWith('getByNameOrNullObject');
      expect(mockStyles.getByNameOrNullObject).toHaveBeenCalledWith('TestStyle');
      expect(highlightStyle.load).toHaveBeenCalledWith('isNullObject');
      expect(mockSelection.style).toEqual('TestStyle');
      expect(mockContext.sync).toHaveBeenCalledTimes(3);
    });
  //als style is nullobject, dan wordt de if niet aanroepen en wordt de style niet gezet
    it('should not highlight selected text when style does not exist', async () => {
      const highlightStyle = {isNullObject: true, load: jest.fn()};
      mockStyles.getByNameOrNullObject.mockReturnValue(highlightStyle);

      await service.highlightSelectedText('NonexistentStyle');

      expect(mockSelection.style).toBeNull();
    });

    it('should handle errors appropriately', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      const error = new Error('Test error');
      (global as any).Word.run.mockImplementation(() => Promise.reject(error));

      await service.highlightSelectedText('TestStyle');

      expect(consoleError).toHaveBeenCalledWith(error);
      consoleError.mockRestore();
    });
  });

});

describe('StyleService', () => {
  let service: StyleService;
  let mockContext: any;
  let mockStyles: any;
  let mockSelection: any;

  beforeEach(() => {
    mockSelection = {
      insertText: jest.fn(),
      style: null
    };

    mockStyles = {
      getByNameOrNullObject: jest.fn(),
      load: jest.fn()
    };

    mockContext = {
      document: {
        getSelection: jest.fn().mockReturnValue(mockSelection),
        getStyles: jest.fn().mockReturnValue(mockStyles),
        addStyle: jest.fn()
      },
      sync: jest.fn()
    };

    (global as any).Word = {
      run: jest.fn((callback) => callback(mockContext))
    };

    service = new StyleService();
  });
  
    describe('getStyleName', () => {
      it('should get style name when style exists', async () => {
        const category: ICategory = { id: 'TestCategory', color: 'TestColor', name: '' , ref: ''};
        const style = { isNullObject: false, load: jest.fn() };
        mockStyles.getByNameOrNullObject.mockReturnValue(style);
  
        const result = await service.getStyleName(category);
  
        expect(mockStyles.load).toHaveBeenCalledWith('getByNameOrNullObject');
        expect(mockStyles.getByNameOrNullObject).toHaveBeenCalledWith('mayday-TestCategory');
        expect(style.load).toHaveBeenCalledWith('isNullObject');
        expect(result).toEqual('mayday-TestCategory');
        expect(mockContext.sync).toHaveBeenCalledTimes(3);
      });
  
      it('should create style when style does not exist', async () => {
        const category: ICategory = { id: 'TestCategory', color: 'TestColor', name: '', ref: '' };
        const style = { isNullObject: true, load: jest.fn() };
        mockStyles.getByNameOrNullObject.mockReturnValue(style);
        const newStyle = { font: {}, shading: {} };
        mockContext.document.addStyle.mockReturnValue(newStyle);
  
        const result = await service.getStyleName(category);
  
        expect(mockStyles.load).toHaveBeenCalledWith('getByNameOrNullObject');
        expect(mockStyles.getByNameOrNullObject).toHaveBeenCalledWith('mayday-TestCategory');
        expect(style.load).toHaveBeenCalledWith('isNullObject');
        expect(mockContext.document.addStyle).toHaveBeenCalledWith('mayday-TestCategory', 'Character');
        expect(result).toEqual('mayday-TestCategory');
        expect(mockContext.sync).toHaveBeenCalledTimes(3);
      });
  
      it('should handle errors appropriately', async () => {
        const category: ICategory = { id: 'TestCategory', color: 'TestColor', name: '', ref: '' };
        const consoleError = jest.spyOn(console, 'error').mockImplementation();
        const error = new Error('Test error');
        (global as any).Word.run.mockImplementation(() => Promise.reject(error));
  
        const result = await service.getStyleName(category);
  
        expect(consoleError).toHaveBeenCalledWith(error);
        expect(result).toBeNull();
        consoleError.mockRestore();
      });
    });
  });
