/** BinaryTreeNode: node for a general tree. */

const { TreeNode } = require("./tree");

class BinaryTreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

class BinaryTree {
  constructor(root = null) {
    this.root = root;
  }

  /** minDepth(): return the minimum depth of the tree -- that is,
   * the length of the shortest path from the root to a leaf. */

  minDepth() {
    let queue = []
    
    if (this.root)
      queue.push([this.root, 1])

    while (queue.length != 0) {
      const [node, depth] = queue.shift()

      if (!node.left || !node.right)
        return depth;

      queue.push([node.left, depth + 1]);
      queue.push([node.right, depth + 1]);
    }

    return 0;
  }

  /** maxDepth(): return the maximum depth of the tree -- that is,
   * the length of the longest path from the root to a leaf. */

  maxDepth() {
    let maxDepth = 0;

    let queue = []
    if (this.root)
      queue.push([this.root, 1]);

    while (queue.length != 0) {
      const [node, depth] = queue.shift();

      maxDepth = Math.max(maxDepth, depth);

      if (node.left)
        queue.push([node.left, depth + 1])
      
      if (node.right)
        queue.push([node.right, depth + 1])
    }

    return maxDepth;
  }

  /** maxSum(): return the maximum sum you can obtain by traveling along a path in the tree.
   * The path doesn't need to start at the root, but you can't visit a node more than once. */

  maxSum() {
    let max = -Infinity
    function postOrderTraversal(node) {
      if (!node)
        return 0;

      const left = Math.max(postOrderTraversal(node.left), 0);
      const right = Math.max(postOrderTraversal(node.right), 0);

      max = Math.max(max, node.val + left + right);
      return Math.max(left, right) + node.val;
    }

    max = Math.max(postOrderTraversal(this.root), max);
    return max;
  }

  /** nextLarger(lowerBound): return the smallest value in the tree
   * which is larger than lowerBound. Return null if no such value exists. */

  nextLarger(lowerBound) {
    let min = null
    function dfs(root) {
      if (root == null) {
        return null;
      }

      if (root.val > lowerBound && (root.val < min || min == null)) {
        min = root.val
      }

      dfs(root.left);
      dfs(root.right);
    }
    dfs(this.root);
    return min;
  }

  /** Further study!
   * areCousins(node1, node2): determine whether two nodes are cousins
   * (i.e. are at the same level but have different parents. ) */

  areCousins(node1, node2) {
    let queue = []

    if (this.root == null || this.root === node1 || this.root === node2)
      return false
    
    if (this.root.left)
      queue.push([this.root.left, this.root])

    if (this.root.right)
      queue.push([this.root.right, this.root])

    while (queue.length != 0) {
      let foundItems = queue.filter((item) => item[0] === node1 || item[0] === node2);
      
      if (foundItems.length == 2 && foundItems[0][1] !== foundItems[1][1])
        return true

      if (foundItems.length == 1 || (foundItems.length == 2 && foundItems[0][1] === foundItems[1][1]))
        return false

      let temp = queue
      queue = []
      temp.forEach(item => {
        if (item[0].left)
          queue.push([item[0].left, item[0]]);
        if (item[0].right)
          queue.push([item[0].right, item[0]]);
      })
    }
    return false
  }

  /** Further study!
   * serialize(tree): serialize the BinaryTree object tree into a string. */

  static serialize(tree) {
    function dfs(root) {
      if (root == null) {
        return "X"
      }

      let left = dfs(root.left)
      let right = dfs(root.right)
      return root.val + "," + left + "," + right
    }
    let res = dfs(tree.root);
    return res;
  }

  /** Further study!
   * deserialize(stringTree): deserialize stringTree into a BinaryTree object. */

  static deserialize(stringTree) {
    let vals = stringTree.split(',');
    let idx = 0
    function dfs() {
      if (vals[idx] == 'X') {
        idx += 1;
        return null;
      }

      let node = new BinaryTreeNode(parseInt(vals[idx]));
      idx += 1;
      node.left = dfs();
      node.right = dfs();
      return node
    }
    return new BinaryTree(dfs());
  }

  /** Further study!
   * lowestCommonAncestor(node1, node2): find the lowest common ancestor
   * of two nodes in a binary tree. */

  lowestCommonAncestor(node1, node2) {
    let lca;
    function postorder(root, node1, node2) {
      if (root == null)
        return false

      let left = postorder(root.left, node1, node2)
      let right = postorder(root.right, node1, node2)
      let current = root === node1 || root === node2

      if (current && left || current && right || left && right)
        lca = root
      return current || left || right
    }
    postorder(this.root, node1, node2)
    return lca
  }
}

module.exports = { BinaryTree, BinaryTreeNode };
