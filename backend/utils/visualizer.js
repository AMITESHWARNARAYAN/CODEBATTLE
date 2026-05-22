/**
 * Visualizer Utility
 * Parses flat array representations into structured objects for frontend rendering.
 */

/**
 * Convert array to Binary Tree structure
 * Input: [1, null, 2, 3]
 * Output: { val: 1, right: { val: 2, left: { val: 3 } } }
 */
export function parseTree(array) {
    if (!array || array.length === 0 || array[0] === null) return null;

    const root = { val: array[0], left: null, right: null };
    const queue = [root];
    let i = 1;

    while (i < array.length) {
        const current = queue.shift();

        // Left child
        if (i < array.length) {
            if (array[i] !== null) {
                current.left = { val: array[i], left: null, right: null };
                queue.push(current.left);
            }
            i++;
        }

        // Right child
        if (i < array.length) {
            if (array[i] !== null) {
                current.right = { val: array[i], left: null, right: null };
                queue.push(current.right);
            }
            i++;
        }
    }

    return root;
}

/**
 * Convert array to Linked List structure
 * Input: [1, 2, 3]
 * Output: { val: 1, next: { val: 2, next: { val: 3, next: null } } }
 */
export function parseLinkedList(array) {
    if (!array || array.length === 0) return null;

    const head = { val: array[0], next: null };
    let current = head;

    for (let i = 1; i < array.length; i++) {
        current.next = { val: array[i], next: null };
        current = current.next;
    }

    return head;
}

/**
 * Main visualizer function
 * Detects type based on problem tags or metadata (mock implementation)
 */
export function getVisualData(input, type) {
    try {
        // Parse input string to array if needed
        const parsedInput = typeof input === 'string' ? JSON.parse(input) : input;

        if (type === 'tree') {
            return parseTree(parsedInput);
        } else if (type === 'linked-list') {
            return parseLinkedList(parsedInput);
        }

        return null;
    } catch (error) {
        console.error('Visualization error:', error);
        return null;
    }
}
