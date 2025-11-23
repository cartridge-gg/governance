const TOKEN_ABI = [
  {
    type: "impl",
    name: "VotesImpl",
    interface_name: "openzeppelin_governance::votes::interface::IVotes",
  },
  {
    type: "struct",
    name: "core::integer::u256",
    members: [
      {
        name: "low",
        type: "core::integer::u128",
      },
      {
        name: "high",
        type: "core::integer::u128",
      },
    ],
  },
  {
    type: "struct",
    name: "core::array::Span::<core::felt252>",
    members: [
      {
        name: "snapshot",
        type: "@core::array::Array::<core::felt252>",
      },
    ],
  },
  {
    type: "interface",
    name: "openzeppelin_governance::votes::interface::IVotes",
    items: [
      {
        type: "function",
        name: "get_votes",
        inputs: [
          {
            name: "account",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_past_votes",
        inputs: [
          {
            name: "account",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "timepoint",
            type: "core::integer::u64",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_past_total_supply",
        inputs: [
          {
            name: "timepoint",
            type: "core::integer::u64",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "delegates",
        inputs: [
          {
            name: "account",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "delegate",
        inputs: [
          {
            name: "delegatee",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "delegate_by_sig",
        inputs: [
          {
            name: "delegator",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "delegatee",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "nonce",
            type: "core::felt252",
          },
          {
            name: "expiry",
            type: "core::integer::u64",
          },
          {
            name: "signature",
            type: "core::array::Span::<core::felt252>",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
    ],
  },
  {
    type: "impl",
    name: "ERC20MixinImpl",
    interface_name: "openzeppelin_token::erc20::interface::IERC20Mixin",
  },
  {
    type: "enum",
    name: "core::bool",
    variants: [
      {
        name: "False",
        type: "()",
      },
      {
        name: "True",
        type: "()",
      },
    ],
  },
  {
    type: "struct",
    name: "core::byte_array::ByteArray",
    members: [
      {
        name: "data",
        type: "core::array::Array::<core::bytes_31::bytes31>",
      },
      {
        name: "pending_word",
        type: "core::felt252",
      },
      {
        name: "pending_word_len",
        type: "core::integer::u32",
      },
    ],
  },
  {
    type: "interface",
    name: "openzeppelin_token::erc20::interface::IERC20Mixin",
    items: [
      {
        type: "function",
        name: "total_supply",
        inputs: [],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "balance_of",
        inputs: [
          {
            name: "account",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "allowance",
        inputs: [
          {
            name: "owner",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "spender",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "transfer",
        inputs: [
          {
            name: "recipient",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "amount",
            type: "core::integer::u256",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "transfer_from",
        inputs: [
          {
            name: "sender",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "recipient",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "amount",
            type: "core::integer::u256",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "approve",
        inputs: [
          {
            name: "spender",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "amount",
            type: "core::integer::u256",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "name",
        inputs: [],
        outputs: [
          {
            type: "core::byte_array::ByteArray",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "symbol",
        inputs: [],
        outputs: [
          {
            type: "core::byte_array::ByteArray",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "decimals",
        inputs: [],
        outputs: [
          {
            type: "core::integer::u8",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "totalSupply",
        inputs: [],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "balanceOf",
        inputs: [
          {
            name: "account",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "transferFrom",
        inputs: [
          {
            name: "sender",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "recipient",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "amount",
            type: "core::integer::u256",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "external",
      },
    ],
  },
  {
    type: "impl",
    name: "NoncesImpl",
    interface_name: "openzeppelin_utils::cryptography::interface::INonces",
  },
  {
    type: "interface",
    name: "openzeppelin_utils::cryptography::interface::INonces",
    items: [
      {
        type: "function",
        name: "nonces",
        inputs: [
          {
            name: "owner",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::felt252",
          },
        ],
        state_mutability: "view",
      },
    ],
  },
  {
    type: "constructor",
    name: "constructor",
    inputs: [
      {
        name: "initial_supply",
        type: "core::integer::u256",
      },
      {
        name: "recipient",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_token::erc20::erc20::ERC20Component::Transfer",
    kind: "struct",
    members: [
      {
        name: "from",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "to",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "value",
        type: "core::integer::u256",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_token::erc20::erc20::ERC20Component::Approval",
    kind: "struct",
    members: [
      {
        name: "owner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "spender",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "value",
        type: "core::integer::u256",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_token::erc20::erc20::ERC20Component::Event",
    kind: "enum",
    variants: [
      {
        name: "Transfer",
        type: "openzeppelin_token::erc20::erc20::ERC20Component::Transfer",
        kind: "nested",
      },
      {
        name: "Approval",
        type: "openzeppelin_token::erc20::erc20::ERC20Component::Approval",
        kind: "nested",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_governance::votes::votes::VotesComponent::DelegateChanged",
    kind: "struct",
    members: [
      {
        name: "delegator",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "from_delegate",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "to_delegate",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_governance::votes::votes::VotesComponent::DelegateVotesChanged",
    kind: "struct",
    members: [
      {
        name: "delegate",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "previous_votes",
        type: "core::integer::u256",
        kind: "data",
      },
      {
        name: "new_votes",
        type: "core::integer::u256",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_governance::votes::votes::VotesComponent::Event",
    kind: "enum",
    variants: [
      {
        name: "DelegateChanged",
        type: "openzeppelin_governance::votes::votes::VotesComponent::DelegateChanged",
        kind: "nested",
      },
      {
        name: "DelegateVotesChanged",
        type: "openzeppelin_governance::votes::votes::VotesComponent::DelegateVotesChanged",
        kind: "nested",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_utils::cryptography::nonces::NoncesComponent::Event",
    kind: "enum",
    variants: [],
  },
  {
    type: "event",
    name: "survivor_governance::survivor_token::SurvivorToken::Event",
    kind: "enum",
    variants: [
      {
        name: "ERC20Event",
        type: "openzeppelin_token::erc20::erc20::ERC20Component::Event",
        kind: "flat",
      },
      {
        name: "VotesEvent",
        type: "openzeppelin_governance::votes::votes::VotesComponent::Event",
        kind: "flat",
      },
      {
        name: "NoncesEvent",
        type: "openzeppelin_utils::cryptography::nonces::NoncesComponent::Event",
        kind: "flat",
      },
    ],
  },
];

export default TOKEN_ABI;
