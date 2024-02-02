import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExcelFileProcessor from '@/app/components/ExcelFileProcessor';
import { FileFormat } from '@/app/models/enums/EFileFormat';

// Mock data for props
const mockProps = {
  excelData: [], // Provide an array of IKeyValuePairs
  filteredDataChanged: false,
  workSheet: null, // Provide a mock XLSX.WorkSheet or null
  setWorkSheet: jest.fn(),
  setExcelData: jest.fn(),
  setFilteredDataChanged: jest.fn(),
  onModalResponse: jest.fn(),
};

describe('ExcelFileProcessor component', () => {
  test('renders without crashing', () => {
    render(<ExcelFileProcessor {...mockProps} />);
    expect(screen.getByLabelText('Select file')).toBeInTheDocument();
  });
});
