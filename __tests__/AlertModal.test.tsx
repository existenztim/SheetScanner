import { render, screen } from '@testing-library/react';
import AlertModal from '@/app/components/AlertModal';

describe('AlertModal component', () => {
  test('Should render the modal with error message and type', () => {
    const modalProps = {
      modal: {
        message: 'This is an error alert message',
        type: 'error',
      },
      closeAlertModal: jest.fn(),
    };

    render(<AlertModal {...modalProps} />);
    const messageElement = screen.getByText('This is an error alert message');
    expect(messageElement).toBeInTheDocument();

    const errorTypeElement = screen.getByText('Error');
    expect(errorTypeElement).toHaveClass('text-red-600');
  });

  test('Should render the modal with information message and type', () => {
    const modalProps = {
      modal: {
        message: 'This is an information alert message',
        type: 'information',
      },
      closeAlertModal: jest.fn(),
    };

    render(<AlertModal {...modalProps} />);
    const messageElement = screen.getByText('This is an information alert message');
    expect(messageElement).toBeInTheDocument();

    const errorTypeElement = screen.getByText('Information');
    expect(errorTypeElement).toHaveClass('text-yellow-600');
  });

  test('Should render the modal with success message and type', () => {
    const modalProps = {
      modal: {
        message: 'This is an success alert message',
        type: 'success',
      },
      closeAlertModal: jest.fn(),
    };

    render(<AlertModal {...modalProps} />);
    const messageElement = screen.getByText('This is an success alert message');
    expect(messageElement).toBeInTheDocument();

    const errorTypeElement = screen.getByText('Success');
    expect(errorTypeElement).toHaveClass('text-green-600');
  });

  test('Should render the modal with default message and type for unknown case', () => {
    const modalProps = {
      modal: {
        message: 'This is an unknown alert message',
        type: 'unknown',
      },
      closeAlertModal: jest.fn(),
    };

    render(<AlertModal {...modalProps} />);
    const messageElement = screen.getByText('This is an unknown alert message');
    expect(messageElement).toBeInTheDocument();

    const defaultTypeElement = screen.getByText('Error'); // Since it's the default behavior
    expect(defaultTypeElement).toHaveClass('text-red-600');
  });
});
