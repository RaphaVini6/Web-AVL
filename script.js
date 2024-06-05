class Node {
    constructor(value, x = 600, y = 20) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1;
        this.x = x;
        this.y = y;
    }
}

class AVLTree {
    constructor() {
        this.root = null;
        this.nodeDistance = 600;
    }

    clear() {
        this.root = null;
        this.updateView();
    }

    getHeight(node) {
        return node ? node.height : 0;
    }

    updateHeight(node) {
        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    }

    getBalanceFactor(node) {
        if (!node) return 0;
        return this.getHeight(node.left) - this.getHeight(node.right);
    }

    rotateRight(y) {
        let x = y.left;
        let T2 = x.right;
        x.right = y;
        y.left = T2;
        this.updateHeight(y);
        this.updateHeight(x);
        return x;
    }

    rotateLeft(x) {
        let y = x.right;
        let T2 = y.left;
        y.left = x;
        x.right = T2;
        this.updateHeight(x);
        this.updateHeight(y);
        return y;
    }

    insert(node, value, x, y, level = 1) {
        if (!node) return new Node(value, x, y);

        if (value < node.value) {
            node.left = this.insert(node.left, value, x - (this.nodeDistance / (level + 1.5)), y + 60, level + 1);
        } else if (value > node.value) {
            node.right = this.insert(node.right, value, x + (this.nodeDistance / (level + 1.5)), y + 60, level + 1);
        } else {
            return node;
        }

        this.updateHeight(node);
        return this.balance(node);
    }

    balance(node) {
        let balance = this.getBalanceFactor(node);

        if (balance > 1 && this.getBalanceFactor(node.left) >= 0) {
            return this.rotateRight(node);
        }
        if (balance > 1 && this.getBalanceFactor(node.left) < 0) {
            node.left = this.rotateLeft(node.left);
            return this.rotateRight(node);
        }
        if (balance < -1 && this.getBalanceFactor(node.right) <= 0) {
            return this.rotateLeft(node);
        }
        if (balance < -1 && this.getBalanceFactor(node.right) > 0) {
            node.right = this.rotateRight(node.right);
            return this.rotateLeft(node);
        }

        return node;
    }

    add(value) {
        if (!this.root || value < this.root.value) {
            const newRoot = new Node(value, window.innerWidth / 2, 20);
            if (this.root) {
                newRoot.left = this.root;
                this.updatePositions(newRoot, window.innerWidth / 2, 20, 1);
            }
            this.root = newRoot;
        } else {
            this.root = this.insert(this.root, value, window.innerWidth / 2, 20);
            this.updatePositions(this.root, window.innerWidth / 2, 20, 1);
        }
        this.updateView();
    }

    updatePositions(node, x, y, level) {
        if (node !== null) {
            node.x = x;
            node.y = y;
            if (node.left !== null) {
                this.updatePositions(node.left, x - (this.nodeDistance / (level + 1.5)), y + 60, level + 1);
            }
            if (node.right !== null) {
                this.updatePositions(node.right, x + (this.nodeDistance / (level + 1.5)), y + 60, level + 1);
            }
        }
    }

    updateView() {
        const canvas = document.getElementById('avlCanvas');
        if (canvas.getContext) {
            const context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
            this.drawNode(this.root, context);
        }
    }

    drawNode(node, context) {
        if (node !== null) {
            if (node.left !== null) {
                context.beginPath();
                context.moveTo(node.x, node.y);
                context.lineTo(node.left.x, node.left.y);
                context.stroke();
            }
            if (node.right !== null) {
                context.beginPath();
                context.moveTo(node.x, node.y);
                context.lineTo(node.right.x, node.right.y);
                context.stroke();
            }
            context.beginPath();
            context.arc(node.x, node.y, 50, 0, 2 * Math.PI);
            context.fill();
            context.stroke();
            context.fillStyle = "white";
            context.textAlign = "center";
            context.font = "50px Arial";
            context.fillText(node.value, node.x, node.y + 6);
            context.fillStyle = "black";
            context.fillText(`H:${node.height} B:${this.getBalanceFactor(node)}`, node.x, node.y - 30);

            this.drawNode(node.left, context);
            this.drawNode(node.right, context);
        }
    }
}

const avl = new AVLTree();

function addValue() {
    const value = parseInt(document.getElementById('valueInput').value);
    if (!isNaN(value)) {
        avl.add(value);
        document.getElementById('valueInput').value = '';
    } else {
        alert('Please enter a valid number.');
    }
}

function clearTree() {
    avl.clear();
}

window.onload = function() {
    const canvas = document.getElementById('avlCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 50;
};