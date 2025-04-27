import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TipTapEditor from './TipTapEditor';

describe('TipTapEditor Component', () => {
  // Test that the component renders
  test('renders the editor', () => {
    const mockOnChange = jest.fn();
    render(<TipTapEditor content="" onChange={mockOnChange} />);

    // Check if the editor container is rendered
    const editorElement = screen.getByRole('textbox');
    expect(editorElement).toBeInTheDocument();
  });

  // Test that the editor displays initial content
  test('displays initial content', () => {
    const initialContent = '<p>Test content</p>';
    const mockOnChange = jest.fn();

    render(<TipTapEditor content={initialContent} onChange={mockOnChange} />);

    // Check if the content is displayed
    const editorContent = screen.getByText('Test content');
    expect(editorContent).toBeInTheDocument();
  });

  // Test that the placeholder is displayed when content is empty
  test('displays placeholder when content is empty', () => {
    const mockOnChange = jest.fn();
    const placeholder = 'Write something...';

    render(<TipTapEditor content="" onChange={mockOnChange} placeholder={placeholder} />);

    // Check if the placeholder is displayed
    const placeholderElement = screen.getByPlaceholderText(placeholder);
    expect(placeholderElement).toBeInTheDocument();
  });

  // Test that the toolbar buttons are rendered
  test('renders toolbar buttons', () => {
    const mockOnChange = jest.fn();
    render(<TipTapEditor content="" onChange={mockOnChange} />);

    // Check if some toolbar buttons are rendered
    const boldButton = screen.getByTitle('Bold');
    const italicButton = screen.getByTitle('Italic');
    const h1Button = screen.getByTitle('Heading 1');

    expect(boldButton).toBeInTheDocument();
    expect(italicButton).toBeInTheDocument();
    expect(h1Button).toBeInTheDocument();
  });

  // Test that the onChange callback is called when content changes
  test('calls onChange when content changes', async () => {
    const mockOnChange = jest.fn();
    render(<TipTapEditor content="" onChange={mockOnChange} />);

    // Get the editor element
    const editorElement = screen.getByRole('textbox');

    // Simulate typing in the editor
    fireEvent.input(editorElement, { target: { innerHTML: '<p>New content</p>' } });

    // Wait for the onChange to be called
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  // Test that the editor updates when content prop changes
  test('updates when content prop changes', () => {
    const mockOnChange = jest.fn();
    const { rerender } = render(<TipTapEditor content="<p>Initial content</p>" onChange={mockOnChange} />);

    // Check initial content
    expect(screen.getByText('Initial content')).toBeInTheDocument();

    // Update the content prop
    rerender(<TipTapEditor content="<p>Updated content</p>" onChange={mockOnChange} />);

    // Check if the content was updated
    expect(screen.getByText('Updated content')).toBeInTheDocument();
  });

  // Test that the editor preserves formatting when content is updated
  test('preserves formatting when content is updated', () => {
    const mockOnChange = jest.fn();
    const formattedContent = '<h1>Heading</h1><p><strong>Bold text</strong> and <em>italic text</em></p>';

    const { rerender } = render(<TipTapEditor content={formattedContent} onChange={mockOnChange} />);

    // Check if formatted content is displayed correctly
    expect(screen.getByText('Heading')).toBeInTheDocument();
    expect(screen.getByText('Bold text')).toBeInTheDocument();
    expect(screen.getByText('italic text')).toBeInTheDocument();

    // Update with different formatted content
    const newFormattedContent = '<h2>New Heading</h2><p>Text with <a href="https://example.com">link</a></p>';
    rerender(<TipTapEditor content={newFormattedContent} onChange={mockOnChange} />);

    // Check if new formatted content is displayed correctly
    expect(screen.getByText('New Heading')).toBeInTheDocument();
    expect(screen.getByText('link')).toBeInTheDocument();
  });

  // Test that complex HTML content is rendered correctly
  test('renders complex HTML content correctly', () => {
    const mockOnChange = jest.fn();
    const complexContent = `
      <h1>Article Title</h1>
      <p>This is a <strong>paragraph</strong> with <em>formatted</em> text.</p>
      <ul>
        <li>List item 1</li>
        <li>List item 2</li>
      </ul>
      <blockquote>This is a quote</blockquote>
    `;

    render(<TipTapEditor content={complexContent} onChange={mockOnChange} />);

    // Check if complex content is displayed correctly
    expect(screen.getByText('Article Title')).toBeInTheDocument();
    expect(screen.getByText('formatted')).toBeInTheDocument();
    expect(screen.getByText('List item 1')).toBeInTheDocument();
    expect(screen.getByText('List item 2')).toBeInTheDocument();
    expect(screen.getByText('This is a quote')).toBeInTheDocument();
  });

  // Test that the editor handles empty content properly
  test('handles empty content properly', () => {
    const mockOnChange = jest.fn();
    const { rerender } = render(<TipTapEditor content="<p>Some content</p>" onChange={mockOnChange} />);

    // Check initial content
    expect(screen.getByText('Some content')).toBeInTheDocument();

    // Update with empty content
    rerender(<TipTapEditor content="" onChange={mockOnChange} />);

    // The editor should be empty now
    expect(screen.queryByText('Some content')).not.toBeInTheDocument();
  });
});
