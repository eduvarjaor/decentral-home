export const contractABI = [
    {
        inputs: [
            { internalType: 'uint256', name: '_rentValue', type: 'uint256' },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'tenant',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'refundAmount',
                type: 'uint256',
            },
        ],
        name: 'RentCancelled',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'tenant',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'RentPaid',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'RentReleased',
        type: 'event',
    },
    {
        inputs: [
            { internalType: 'uint256', name: '_id', type: 'uint256' },
            { internalType: 'string', name: '_title', type: 'string' },
            { internalType: 'string', name: '_description', type: 'string' },
        ],
        name: 'addProperty',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'propertyId', type: 'uint256' },
        ],
        name: 'cancelRent',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'propertyId', type: 'uint256' },
        ],
        name: 'endRent',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getProperties',
        outputs: [
            {
                components: [
                    { internalType: 'uint256', name: 'id', type: 'uint256' },
                    { internalType: 'string', name: 'title', type: 'string' },
                    {
                        internalType: 'string',
                        name: 'description',
                        type: 'string',
                    },
                    { internalType: 'bool', name: 'isRented', type: 'bool' },
                    {
                        internalType: 'address',
                        name: 'tenant',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'rentDeposit',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'rentStartTime',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'rentEndTime',
                        type: 'uint256',
                    },
                ],
                internalType: 'struct PropertyRent.Property[]',
                name: '',
                type: 'tuple[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'initializeProperties',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [
            { internalType: 'address payable', name: '', type: 'address' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        name: 'properties',
        outputs: [
            { internalType: 'uint256', name: 'id', type: 'uint256' },
            { internalType: 'string', name: 'title', type: 'string' },
            { internalType: 'string', name: 'description', type: 'string' },
            { internalType: 'bool', name: 'isRented', type: 'bool' },
            { internalType: 'address', name: 'tenant', type: 'address' },
            { internalType: 'uint256', name: 'rentDeposit', type: 'uint256' },
            { internalType: 'uint256', name: 'rentStartTime', type: 'uint256' },
            { internalType: 'uint256', name: 'rentEndTime', type: 'uint256' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'propertyId', type: 'uint256' },
            {
                internalType: 'uint256',
                name: '_rentStartTime',
                type: 'uint256',
            },
            { internalType: 'uint256', name: '_rentEndTime', type: 'uint256' },
        ],
        name: 'rent',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'rentValue',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
];
