import { useState, useEffect } from 'react';
import { getItems, createItem, updateItem, deleteItem } from '../services/api';

export default function ItemDashboard({ user }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Edit State
  const [editingItem, setEditingItem] = useState(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await getItems();
      setItems(data.items || []);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch items');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      await createItem(title, description);
      setTitle('');
      setDescription('');
      setSubmitting(false);
      fetchItems();
    } catch (err) {
      setError(err.message || 'Failed to create item');
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingItem || !editingItem.title.trim()) return;

    try {
      await updateItem(editingItem.id, editingItem.title, editingItem.description);
      setEditingItem(null);
      fetchItems();
    } catch (err) {
      setError(err.message || 'Failed to update item');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await deleteItem(id);
      fetchItems();
    } catch (err) {
      setError(err.message || 'Failed to delete item');
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="dashboard-container">
      {/* User Info Bar */}
      <div className="user-banner glassmorphism">
        <div className="user-avatar">👤</div>
        <div>
          <h2>User Dashboard</h2>
          <p>
            Logged in as <strong>{user.email}</strong> • Platform ID: <code>{user.platformId}</code>
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
          <button className="close-btn" onClick={() => setError(null)}>
            ×
          </button>
        </div>
      )}

      {/* Main Grid: Left = Create Item, Right = Items List */}
      <div className="dashboard-grid">
        {/* Create Item Section */}
        <div className="panel-card glassmorphism">
          <h3>Create New Item</h3>

          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label htmlFor="item-title">Title</label>
              <input
                id="item-title"
                type="text"
                placeholder="e.g. Deployment Architecture Document"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="item-desc">Description</label>
              <textarea
                id="item-desc"
                rows={4}
                placeholder="Detailed description of the item..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary full-width" disabled={submitting}>
              {submitting ? 'Saving...' : '➕ Add Item'}
            </button>
          </form>
        </div>

        {/* Items List Section */}
        <div className="panel-card glassmorphism">
          <div className="panel-header">
            <div>
              <h3>Items Module ({filteredItems.length})</h3>
              <p className="panel-desc">Manage your CRUD records</p>
            </div>
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading items from database...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h4>No Items Found</h4>
              <p>{search ? 'No items match your search term.' : 'Create your first item using the form.'}</p>
            </div>
          ) : (
            <div className="items-list">
              {filteredItems.map((item) => (
                <div key={item.id} className="item-card glassmorphism-subtle">
                  <div className="item-main">
                    <h4>{item.title}</h4>
                    {item.description && <p>{item.description}</p>}
                    <div className="item-meta">
                      <span>Owner: <code>{item.owner?.platformId || user.platformId}</code></span>
                      <span>Created: {new Date(item.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="item-actions">
                    <button
                      className="btn-secondary btn-sm"
                      onClick={() => setEditingItem(item)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn-danger btn-sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="modal-backdrop">
          <div className="modal-card glassmorphism animate-pop">
            <h3>Edit Item</h3>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows={4}
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setEditingItem(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
