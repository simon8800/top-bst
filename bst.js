const Node = require("./node");

class Tree {
  constructor(root) {
    this.root = root;
  }

  insert(data) {
    let node = this._insertRecursion(this.root, data);
    return node;
  }

  _insertRecursion(root, data) {
    if (root == null) {
      root = new Node(data);
      return root;
    }

    if (data < root.value) {
      root.left = this._insertRecursion(root.left, data);
    } else if (data > root.value) {
      root.right = this._insertRecursion(root.right, data);
    }

    return root;
  }

  delete(data) {
    let root = this._deleteRecursion(this.root, data);
    return root;
  }

  _deleteRecursion(root, data) {
    // Base case
    if (root == null) {
      return root;
    }

    // If the key to be deleted is smaller than root key, then it's in the left subtree
    if (data < root.value) {
      root.left = this._deleteRecursion(root.left, data);
      // If the key to be deleted is greater than root key, then it's in the right subtree
    } else if (data > root.value) {
      root.right = this._deleteRecursion(root.right, data);
      // If the key to be deleted is the same as root key, then this is the node to be deleted
    } else {
      // Node with only one or no child
      if (root.left === null) {
        return root.right;
      } else if (root.right === null) {
        return root.left;
      }
      // Node with two children: get the inorder successor (smallest in right subtree)
      // "Swap the value"
      root.value = this._minValue(root.right);
      // Remove that value
      root.right = this._deleteRecursion(root.right, root.key);
    }
    return root;
  }

  _minValue(node) {
    let minv = node.value;
    while (node.left !== null) {
      minv = node.left.value;
      node = node.left;
    }
    return minv;
  }

  find(data) {
    let root = this.root;
    while (root !== null) {
      if (data < root.value) {
        root = root.left;
      } else if (data > root.value) {
        root = root.right;
      } else if (data === root.value) {
        return root;
      }
    }
    return null;
  }

  levelOrder(callback) {
    let nodeQueue = [];
    nodeQueue.push(this.root);
    let nodeValues = [];

    while (nodeQueue.length > 0) {
      let node = nodeQueue.shift();
      if (typeof callback === "function") {
        callback(node);
      }
      if (node.left !== null) {
        nodeQueue.push(node.left);
      }

      if (node.right !== null) {
        nodeQueue.push(node.right);
      }

      nodeValues.push(node.value);
    }

    if (typeof callback !== "function") {
      return nodeValues;
    }
  }

  inOrder(callback) {
    let nodeValues = [];
    this._inOrderHelper(this.root, nodeValues, callback);
    if (typeof callback !== "function") {
      return nodeValues;
    }
  }

  _inOrderHelper(root, nodeValues, callback) {
    if (root === null) {
      return;
    }

    // left
    this._inOrderHelper(root.left, nodeValues, callback);
    // root
    if (typeof callback === "function") {
      callback(root);
    }
    nodeValues.push(root.value);
    // right
    this._inOrderHelper(root.right, nodeValues, callback);
  }

  preOrder(callback) {
    let nodeValues = [];
    this._preOrderHelper(this.root, nodeValues, callback);
    if (typeof callback !== "function") {
      return nodeValues;
    }
  }

  _preOrderHelper(root, nodeValues, callback) {
    if (root !== null) {
      if (typeof callback === "function") {
        callback(root);
      }
      nodeValues.push(root.value);
      this._preOrderHelper(root.left, nodeValues, callback);
      this._preOrderHelper(root.right, nodeValues, callback);
    }
  }

  postOrder(callback) {
    let nodeValues = [];
    this._postOrderHelper(this.root, nodeValues, callback);
    if (typeof callback !== "function") {
      return nodeValues;
    }
  }

  _postOrderHelper(root, nodeValues, callback) {
    if (root !== null) {
      this._postOrderHelper(root.left, nodeValues, callback);
      this._postOrderHelper(root.right, nodeValues, callback);
      nodeValues.push(root.value);
      if (typeof callback === "function") {
        callback(root);
      }
    }
  }

  height(node) {
    if (node === null) {
      return 0;
    } else {
      let leftHeight = this.height(node.left);
      let righHeight = this.height(node.right);

      if (leftHeight > righHeight) {
        return leftHeight + 1;
      } else {
        return righHeight + 1;
      }
    }
  }

  depth(node) {
    return this._depthHelper(this.root, node.value, 1);
  }

  _depthHelper(node, data, dist) {
    if (node === null) {
      return 0;
    }

    if (node.value === data) {
      console.log("found", node.value, data);
      return dist;
    }

    if (data < node.value) {
      return this._depthHelper(node.left, data, dist + 1);
    } else {
      return this._depthHelper(node.right, data, dist + 1);
    }
  }

  isBalanced() {
    return this._checkBalance(this.root) !== -1;
  }

  _checkBalance(node) {
    if (node === null) {
      return 0;
    }

    let leftHeight = this._checkBalance(node.left);
    let rightHeight = this._checkBalance(node.right);

    if (leftHeight == -1 || rightHeight == -1) {
      return -1;
    }

    if (Math.abs(leftHeight - rightHeight) > 1) {
      return -1;
    }

    return Math.max(leftHeight, rightHeight) + 1;
  }

  rebalance() {
    let values = this.inOrder();
    let newRoot = buildTree(values);
    this.root = newRoot;
    return this.root;
  }
}

function buildTree(arr) {
  arr = arr.sort((a, b) => a - b);
  arr = removeDuplicates(arr);
  let root = sortArrToBST(arr, 0, arr.length - 1);
  return root;
}

function sortArrToBST(arr, start, end) {
  if (start > end) {
    return null;
  }

  let mid = parseInt((start + end) / 2);
  let node = new Node(arr[mid]);
  node.left = sortArrToBST(arr, start, mid - 1);
  node.right = sortArrToBST(arr, mid + 1, end);
  return node;
}

function removeDuplicates(arr) {
  return [...new Set(arr)];
}

function prettyPrint(node, prefix = "", isLeft = true) {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
}

// Driver code
let initialData = [];
for (let i = 0; i < 100; i++) {
  initialData.push(i);
}

let root = buildTree(initialData);
let myTree = new Tree(root);
console.log(myTree.isBalanced());
console.log(myTree.preOrder());
console.log(myTree.inOrder());
console.log(myTree.postOrder());

for (let i = 100; i < 150; i++) {
  myTree.insert(i);
}

console.log("Before balancing:", myTree.isBalanced());
myTree.rebalance();
console.log("After balancing:", myTree.isBalanced());
console.log(myTree.preOrder());
console.log(myTree.inOrder());
console.log(myTree.postOrder());
