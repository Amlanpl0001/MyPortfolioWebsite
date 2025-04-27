import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import AdminDashboard from './AdminDashboard';

// Mock the AuthContext
jest.mock('../../contexts/AuthContext', () => ({
  ...jest.requireActual('../../contexts/AuthContext'),
  useAuth: () => ({
    isAdmin: () => true,
    isAuthenticated: () => true,
  }),
}));

// Mock the TipTapEditor component
jest.mock('../../components/TipTapEditor/TipTapEditor', () => {
  return function MockTipTapEditor({ content, onChange, placeholder }) {
    return (
      <div data-testid="mock-tiptap-editor">
        <div>{placeholder}</div>
        <div data-testid="editor-content">{content}</div>
        <button 
          data-testid="editor-change-button" 
          onClick={() => onChange('<p>Updated content from TipTap</p>')}
        >
          Update Content
        </button>
      </div>
    );
  };
});

const renderWithRouter = (ui, { route = '/admin' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(
    <BrowserRouter>
      <AuthProvider>
        {ui}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('AdminDashboard Component', () => {
  // Test that the dashboard renders
  test('renders the admin dashboard', () => {
    renderWithRouter(<AdminDashboard />);
    
    // Check if the dashboard title is rendered
    const dashboardTitle = screen.getByText('Admin Dashboard');
    expect(dashboardTitle).toBeInTheDocument();
  });

  // Test that the blog posts management section works
  test('navigates to blog posts management', async () => {
    renderWithRouter(<AdminDashboard />);
    
    // Click on the "Manage Posts" link
    const managePostsLink = screen.getByText('Manage Posts');
    fireEvent.click(managePostsLink);
    
    // Wait for the posts to load
    await waitFor(() => {
      const postsTitle = screen.getByText('Manage Blog Posts');
      expect(postsTitle).toBeInTheDocument();
    });
  });

  // Test that the "Add New Post" button shows the form
  test('shows post form when "Add New Post" is clicked', async () => {
    renderWithRouter(<AdminDashboard />, { route: '/admin/posts' });
    
    // Wait for the posts to load
    await waitFor(() => {
      const postsTitle = screen.getByText('Manage Blog Posts');
      expect(postsTitle).toBeInTheDocument();
    });
    
    // Click on the "Add New Post" button
    const addButton = screen.getByText('Add New Post');
    fireEvent.click(addButton);
    
    // Check if the form is displayed
    const formTitle = screen.getByText('Create New Post');
    expect(formTitle).toBeInTheDocument();
    
    // Check if the TipTap editor is rendered
    const editor = screen.getByTestId('mock-tiptap-editor');
    expect(editor).toBeInTheDocument();
  });

  // Test that the form can be submitted with TipTap content
  test('can submit form with TipTap content', async () => {
    renderWithRouter(<AdminDashboard />, { route: '/admin/posts' });
    
    // Wait for the posts to load
    await waitFor(() => {
      const postsTitle = screen.getByText('Manage Blog Posts');
      expect(postsTitle).toBeInTheDocument();
    });
    
    // Click on the "Add New Post" button
    const addButton = screen.getByText('Add New Post');
    fireEvent.click(addButton);
    
    // Fill in the form
    const titleInput = screen.getByLabelText('Title');
    fireEvent.change(titleInput, { target: { value: 'Test Post Title' } });
    
    const topicSelect = screen.getByLabelText('Topic');
    fireEvent.change(topicSelect, { target: { value: '1' } });
    
    // Update the TipTap editor content
    const editorUpdateButton = screen.getByTestId('editor-change-button');
    fireEvent.click(editorUpdateButton);
    
    // Submit the form
    const submitButton = screen.getByText('Save Post');
    fireEvent.click(submitButton);
    
    // Wait for the post to be added
    await waitFor(() => {
      // The form should be hidden after submission
      expect(screen.queryByText('Create New Post')).not.toBeInTheDocument();
      
      // The new post should appear in the list
      expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    });
  });

  // Test that the edit functionality works with TipTap
  test('can edit a post with TipTap editor', async () => {
    renderWithRouter(<AdminDashboard />, { route: '/admin/posts' });
    
    // Wait for the posts to load
    await waitFor(() => {
      const postsTitle = screen.getByText('Manage Blog Posts');
      expect(postsTitle).toBeInTheDocument();
    });
    
    // Click on the first "Edit" button
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    
    // Check if the form is displayed with "Edit Post" title
    const formTitle = screen.getByText('Edit Post');
    expect(formTitle).toBeInTheDocument();
    
    // Check if the TipTap editor is rendered with content
    const editorContent = screen.getByTestId('editor-content');
    expect(editorContent).toBeInTheDocument();
    
    // Update the title
    const titleInput = screen.getByLabelText('Title');
    fireEvent.change(titleInput, { target: { value: 'Updated Post Title' } });
    
    // Update the TipTap editor content
    const editorUpdateButton = screen.getByTestId('editor-change-button');
    fireEvent.click(editorUpdateButton);
    
    // Submit the form
    const submitButton = screen.getByText('Save Post');
    fireEvent.click(submitButton);
    
    // Wait for the post to be updated
    await waitFor(() => {
      // The form should be hidden after submission
      expect(screen.queryByText('Edit Post')).not.toBeInTheDocument();
      
      // The updated post should appear in the list
      expect(screen.getByText('Updated Post Title')).toBeInTheDocument();
    });
  });
});