// ==============================================================================
// BONDFIRE MEMORY GRAPH SERVICE (js/services/memoryGraphService.js)
// Human-meaning graph organizer: People, Dates, Places, Quotes, Food, Running Jokes
// Every node has strict user consent: Approve, Edit, Ignore, Delete
// ==============================================================================

import { store } from '../state/store.js';

export const MemoryGraphService = {
  /**
   * Get all memory nodes from the active state
   */
  getNodes() {
    const state = store.getState();
    return state.memoryGraphNodes || [];
  },

  /**
   * Filter nodes by category
   */
  getNodesByCategory(category) {
    const nodes = this.getNodes();
    if (!category || category === 'ALL') return nodes;
    return nodes.filter((n) => n.category === category);
  },

  /**
   * Approve a pending memory node
   */
  approveNode(nodeId) {
    const state = store.getState();
    const updated = (state.memoryGraphNodes || []).map((node) => {
      if (node.id === nodeId) {
        return { ...node, status: 'APPROVED', updatedAt: new Date().toISOString() };
      }
      return node;
    });
    store.setState({ memoryGraphNodes: updated });
  },

  /**
   * Ignore or hide a memory node from games
   */
  ignoreNode(nodeId) {
    const state = store.getState();
    const updated = (state.memoryGraphNodes || []).map((node) => {
      if (node.id === nodeId) {
        return { ...node, status: 'IGNORED', updatedAt: new Date().toISOString() };
      }
      return node;
    });
    store.setState({ memoryGraphNodes: updated });
  },

  /**
   * Permanently delete a memory node
   */
  deleteNode(nodeId) {
    const state = store.getState();
    const updated = (state.memoryGraphNodes || []).filter((node) => node.id !== nodeId);
    store.setState({ memoryGraphNodes: updated });
  },

  /**
   * Edit a memory node's title or snippet
   */
  editNode(nodeId, newTitle, newSnippet) {
    const state = store.getState();
    const updated = (state.memoryGraphNodes || []).map((node) => {
      if (node.id === nodeId) {
        return {
          ...node,
          title: newTitle || node.title,
          contextSnippet: newSnippet !== undefined ? newSnippet : node.contextSnippet,
          updatedAt: new Date().toISOString()
        };
      }
      return node;
    });
    store.setState({ memoryGraphNodes: updated });
  },

  /**
   * Add a new node (e.g. from a weekly memory mission or manual quote entry)
   */
  addNode(category, title, snippet = '', mediaUrl = '') {
    const state = store.getState();
    const newNode = {
      id: `node_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      category: category || 'QUOTES',
      title,
      contextSnippet: snippet,
      mediaUrl,
      eventDate: new Date().toISOString().split('T')[0],
      sentimentTag: 'FUNNY',
      status: 'APPROVED',
      createdAt: new Date().toISOString()
    };
    const updated = [newNode, ...(state.memoryGraphNodes || [])];
    store.setState({ memoryGraphNodes: updated });
    return newNode;
  }
};
