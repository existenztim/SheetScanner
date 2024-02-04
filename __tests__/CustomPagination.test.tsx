import CustomPagination from '@/app/components/CustomPagination';
import { render, screen, fireEvent } from '@testing-library/react';

describe('CustomPagination component', () => {
  test('renders buttons correctly based on totalItems and itemsPerPage', () => {
    render(<CustomPagination currentPage={1} totalItems={20} itemsPerPage={5} paginate={() => {}} />);

    // Expect 4 buttons to be rendered (20 total items / 5 items per page)
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);
  });

  test('calls paginate function with correct page number when a button is clicked', () => {
    const mockPaginate = jest.fn();
    render(<CustomPagination currentPage={1} totalItems={20} itemsPerPage={5} paginate={mockPaginate} />);

    fireEvent.click(screen.getByText('2'));

    expect(mockPaginate).toHaveBeenCalledWith(2);
    expect(mockPaginate).toHaveBeenCalledTimes(1);
  });

  test('highlights the current page with correct styling', () => {
    render(<CustomPagination currentPage={3} totalItems={20} itemsPerPage={5} paginate={() => {}} />);

    const activeButton = screen.getByText('3');
    expect(activeButton).toHaveClass('bg-green-700');
    expect(activeButton).toHaveClass('text-slate-50');
  });
});
