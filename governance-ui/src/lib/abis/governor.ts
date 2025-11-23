const GOVERNOR_ABI = [
  {
    type: "impl",
    name: "GovernorImpl",
    interface_name: "openzeppelin_governance::governor::interface::IGovernor",
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
    type: "struct",
    name: "core::starknet::account::Call",
    members: [
      {
        name: "to",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "selector",
        type: "core::felt252",
      },
      {
        name: "calldata",
        type: "core::array::Span::<core::felt252>",
      },
    ],
  },
  {
    type: "struct",
    name: "core::array::Span::<core::starknet::account::Call>",
    members: [
      {
        name: "snapshot",
        type: "@core::array::Array::<core::starknet::account::Call>",
      },
    ],
  },
  {
    type: "enum",
    name: "openzeppelin_governance::governor::interface::ProposalState",
    variants: [
      {
        name: "Pending",
        type: "()",
      },
      {
        name: "Active",
        type: "()",
      },
      {
        name: "Canceled",
        type: "()",
      },
      {
        name: "Defeated",
        type: "()",
      },
      {
        name: "Succeeded",
        type: "()",
      },
      {
        name: "Queued",
        type: "()",
      },
      {
        name: "Executed",
        type: "()",
      },
    ],
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
    type: "interface",
    name: "openzeppelin_governance::governor::interface::IGovernor",
    items: [
      {
        type: "function",
        name: "name",
        inputs: [],
        outputs: [
          {
            type: "core::felt252",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "version",
        inputs: [],
        outputs: [
          {
            type: "core::felt252",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "COUNTING_MODE",
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
        name: "hash_proposal",
        inputs: [
          {
            name: "calls",
            type: "core::array::Span::<core::starknet::account::Call>",
          },
          {
            name: "description_hash",
            type: "core::felt252",
          },
        ],
        outputs: [
          {
            type: "core::felt252",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "state",
        inputs: [
          {
            name: "proposal_id",
            type: "core::felt252",
          },
        ],
        outputs: [
          {
            type: "openzeppelin_governance::governor::interface::ProposalState",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "proposal_threshold",
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
        name: "proposal_snapshot",
        inputs: [
          {
            name: "proposal_id",
            type: "core::felt252",
          },
        ],
        outputs: [
          {
            type: "core::integer::u64",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "proposal_deadline",
        inputs: [
          {
            name: "proposal_id",
            type: "core::felt252",
          },
        ],
        outputs: [
          {
            type: "core::integer::u64",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "proposal_proposer",
        inputs: [
          {
            name: "proposal_id",
            type: "core::felt252",
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
        name: "proposal_eta",
        inputs: [
          {
            name: "proposal_id",
            type: "core::felt252",
          },
        ],
        outputs: [
          {
            type: "core::integer::u64",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "proposal_needs_queuing",
        inputs: [
          {
            name: "proposal_id",
            type: "core::felt252",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "voting_delay",
        inputs: [],
        outputs: [
          {
            type: "core::integer::u64",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "voting_period",
        inputs: [],
        outputs: [
          {
            type: "core::integer::u64",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "quorum",
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
        name: "get_votes",
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
        name: "get_votes_with_params",
        inputs: [
          {
            name: "account",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "timepoint",
            type: "core::integer::u64",
          },
          {
            name: "params",
            type: "core::array::Span::<core::felt252>",
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
        name: "has_voted",
        inputs: [
          {
            name: "proposal_id",
            type: "core::felt252",
          },
          {
            name: "account",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "propose",
        inputs: [
          {
            name: "calls",
            type: "core::array::Span::<core::starknet::account::Call>",
          },
          {
            name: "description",
            type: "core::byte_array::ByteArray",
          },
        ],
        outputs: [
          {
            type: "core::felt252",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "queue",
        inputs: [
          {
            name: "calls",
            type: "core::array::Span::<core::starknet::account::Call>",
          },
          {
            name: "description_hash",
            type: "core::felt252",
          },
        ],
        outputs: [
          {
            type: "core::felt252",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "execute",
        inputs: [
          {
            name: "calls",
            type: "core::array::Span::<core::starknet::account::Call>",
          },
          {
            name: "description_hash",
            type: "core::felt252",
          },
        ],
        outputs: [
          {
            type: "core::felt252",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "cancel",
        inputs: [
          {
            name: "calls",
            type: "core::array::Span::<core::starknet::account::Call>",
          },
          {
            name: "description_hash",
            type: "core::felt252",
          },
        ],
        outputs: [
          {
            type: "core::felt252",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "cast_vote",
        inputs: [
          {
            name: "proposal_id",
            type: "core::felt252",
          },
          {
            name: "support",
            type: "core::integer::u8",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "cast_vote_with_reason",
        inputs: [
          {
            name: "proposal_id",
            type: "core::felt252",
          },
          {
            name: "support",
            type: "core::integer::u8",
          },
          {
            name: "reason",
            type: "core::byte_array::ByteArray",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "cast_vote_with_reason_and_params",
        inputs: [
          {
            name: "proposal_id",
            type: "core::felt252",
          },
          {
            name: "support",
            type: "core::integer::u8",
          },
          {
            name: "reason",
            type: "core::byte_array::ByteArray",
          },
          {
            name: "params",
            type: "core::array::Span::<core::felt252>",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "cast_vote_by_sig",
        inputs: [
          {
            name: "proposal_id",
            type: "core::felt252",
          },
          {
            name: "support",
            type: "core::integer::u8",
          },
          {
            name: "voter",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "signature",
            type: "core::array::Span::<core::felt252>",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "cast_vote_with_reason_and_params_by_sig",
        inputs: [
          {
            name: "proposal_id",
            type: "core::felt252",
          },
          {
            name: "support",
            type: "core::integer::u8",
          },
          {
            name: "voter",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "reason",
            type: "core::byte_array::ByteArray",
          },
          {
            name: "params",
            type: "core::array::Span::<core::felt252>",
          },
          {
            name: "signature",
            type: "core::array::Span::<core::felt252>",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "nonces",
        inputs: [
          {
            name: "voter",
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
      {
        type: "function",
        name: "relay",
        inputs: [
          {
            name: "call",
            type: "core::starknet::account::Call",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
    ],
  },
  {
    type: "impl",
    name: "QuorumFractionImpl",
    interface_name:
      "openzeppelin_governance::governor::extensions::interface::IQuorumFraction",
  },
  {
    type: "interface",
    name: "openzeppelin_governance::governor::extensions::interface::IQuorumFraction",
    items: [
      {
        type: "function",
        name: "token",
        inputs: [],
        outputs: [
          {
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "current_quorum_numerator",
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
        name: "quorum_numerator",
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
        name: "quorum_denominator",
        inputs: [],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
    ],
  },
  {
    type: "impl",
    name: "GovernorSettingsAdminImpl",
    interface_name:
      "openzeppelin_governance::governor::extensions::interface::IGovernorSettingsAdmin",
  },
  {
    type: "interface",
    name: "openzeppelin_governance::governor::extensions::interface::IGovernorSettingsAdmin",
    items: [
      {
        type: "function",
        name: "set_voting_delay",
        inputs: [
          {
            name: "new_voting_delay",
            type: "core::integer::u64",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "set_voting_period",
        inputs: [
          {
            name: "new_voting_period",
            type: "core::integer::u64",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "set_proposal_threshold",
        inputs: [
          {
            name: "new_proposal_threshold",
            type: "core::integer::u256",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
    ],
  },
  {
    type: "impl",
    name: "TimelockedImpl",
    interface_name:
      "openzeppelin_governance::governor::extensions::interface::ITimelocked",
  },
  {
    type: "interface",
    name: "openzeppelin_governance::governor::extensions::interface::ITimelocked",
    items: [
      {
        type: "function",
        name: "timelock",
        inputs: [],
        outputs: [
          {
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_timelock_id",
        inputs: [
          {
            name: "proposal_id",
            type: "core::felt252",
          },
        ],
        outputs: [
          {
            type: "core::felt252",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "update_timelock",
        inputs: [
          {
            name: "new_timelock",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
    ],
  },
  {
    type: "impl",
    name: "SRC5Impl",
    interface_name: "openzeppelin_introspection::interface::ISRC5",
  },
  {
    type: "interface",
    name: "openzeppelin_introspection::interface::ISRC5",
    items: [
      {
        type: "function",
        name: "supports_interface",
        inputs: [
          {
            name: "interface_id",
            type: "core::felt252",
          },
        ],
        outputs: [
          {
            type: "core::bool",
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
        name: "votes_token",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "timelock_controller",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
  },
  {
    type: "struct",
    name: "core::array::Span::<core::array::Span::<core::felt252>>",
    members: [
      {
        name: "snapshot",
        type: "@core::array::Array::<core::array::Span::<core::felt252>>",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_governance::governor::governor::GovernorComponent::ProposalCreated",
    kind: "struct",
    members: [
      {
        name: "proposal_id",
        type: "core::felt252",
        kind: "key",
      },
      {
        name: "proposer",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "calls",
        type: "core::array::Span::<core::starknet::account::Call>",
        kind: "data",
      },
      {
        name: "signatures",
        type: "core::array::Span::<core::array::Span::<core::felt252>>",
        kind: "data",
      },
      {
        name: "vote_start",
        type: "core::integer::u64",
        kind: "data",
      },
      {
        name: "vote_end",
        type: "core::integer::u64",
        kind: "data",
      },
      {
        name: "description",
        type: "core::byte_array::ByteArray",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_governance::governor::governor::GovernorComponent::ProposalQueued",
    kind: "struct",
    members: [
      {
        name: "proposal_id",
        type: "core::felt252",
        kind: "key",
      },
      {
        name: "eta_seconds",
        type: "core::integer::u64",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_governance::governor::governor::GovernorComponent::ProposalExecuted",
    kind: "struct",
    members: [
      {
        name: "proposal_id",
        type: "core::felt252",
        kind: "key",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_governance::governor::governor::GovernorComponent::ProposalCanceled",
    kind: "struct",
    members: [
      {
        name: "proposal_id",
        type: "core::felt252",
        kind: "key",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_governance::governor::governor::GovernorComponent::VoteCast",
    kind: "struct",
    members: [
      {
        name: "voter",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "proposal_id",
        type: "core::felt252",
        kind: "data",
      },
      {
        name: "support",
        type: "core::integer::u8",
        kind: "data",
      },
      {
        name: "weight",
        type: "core::integer::u256",
        kind: "data",
      },
      {
        name: "reason",
        type: "core::byte_array::ByteArray",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_governance::governor::governor::GovernorComponent::VoteCastWithParams",
    kind: "struct",
    members: [
      {
        name: "voter",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "proposal_id",
        type: "core::felt252",
        kind: "data",
      },
      {
        name: "support",
        type: "core::integer::u8",
        kind: "data",
      },
      {
        name: "weight",
        type: "core::integer::u256",
        kind: "data",
      },
      {
        name: "reason",
        type: "core::byte_array::ByteArray",
        kind: "data",
      },
      {
        name: "params",
        type: "core::array::Span::<core::felt252>",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_governance::governor::governor::GovernorComponent::Event",
    kind: "enum",
    variants: [
      {
        name: "ProposalCreated",
        type: "openzeppelin_governance::governor::governor::GovernorComponent::ProposalCreated",
        kind: "nested",
      },
      {
        name: "ProposalQueued",
        type: "openzeppelin_governance::governor::governor::GovernorComponent::ProposalQueued",
        kind: "nested",
      },
      {
        name: "ProposalExecuted",
        type: "openzeppelin_governance::governor::governor::GovernorComponent::ProposalExecuted",
        kind: "nested",
      },
      {
        name: "ProposalCanceled",
        type: "openzeppelin_governance::governor::governor::GovernorComponent::ProposalCanceled",
        kind: "nested",
      },
      {
        name: "VoteCast",
        type: "openzeppelin_governance::governor::governor::GovernorComponent::VoteCast",
        kind: "nested",
      },
      {
        name: "VoteCastWithParams",
        type: "openzeppelin_governance::governor::governor::GovernorComponent::VoteCastWithParams",
        kind: "nested",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_governance::governor::extensions::governor_votes_quorum_fraction::GovernorVotesQuorumFractionComponent::QuorumNumeratorUpdated",
    kind: "struct",
    members: [
      {
        name: "old_quorum_numerator",
        type: "core::integer::u256",
        kind: "data",
      },
      {
        name: "new_quorum_numerator",
        type: "core::integer::u256",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_governance::governor::extensions::governor_votes_quorum_fraction::GovernorVotesQuorumFractionComponent::Event",
    kind: "enum",
    variants: [
      {
        name: "QuorumNumeratorUpdated",
        type: "openzeppelin_governance::governor::extensions::governor_votes_quorum_fraction::GovernorVotesQuorumFractionComponent::QuorumNumeratorUpdated",
        kind: "nested",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_governance::governor::extensions::governor_settings::GovernorSettingsComponent::VotingDelayUpdated",
    kind: "struct",
    members: [
      {
        name: "old_voting_delay",
        type: "core::integer::u64",
        kind: "data",
      },
      {
        name: "new_voting_delay",
        type: "core::integer::u64",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_governance::governor::extensions::governor_settings::GovernorSettingsComponent::VotingPeriodUpdated",
    kind: "struct",
    members: [
      {
        name: "old_voting_period",
        type: "core::integer::u64",
        kind: "data",
      },
      {
        name: "new_voting_period",
        type: "core::integer::u64",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_governance::governor::extensions::governor_settings::GovernorSettingsComponent::ProposalThresholdUpdated",
    kind: "struct",
    members: [
      {
        name: "old_proposal_threshold",
        type: "core::integer::u256",
        kind: "data",
      },
      {
        name: "new_proposal_threshold",
        type: "core::integer::u256",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_governance::governor::extensions::governor_settings::GovernorSettingsComponent::Event",
    kind: "enum",
    variants: [
      {
        name: "VotingDelayUpdated",
        type: "openzeppelin_governance::governor::extensions::governor_settings::GovernorSettingsComponent::VotingDelayUpdated",
        kind: "nested",
      },
      {
        name: "VotingPeriodUpdated",
        type: "openzeppelin_governance::governor::extensions::governor_settings::GovernorSettingsComponent::VotingPeriodUpdated",
        kind: "nested",
      },
      {
        name: "ProposalThresholdUpdated",
        type: "openzeppelin_governance::governor::extensions::governor_settings::GovernorSettingsComponent::ProposalThresholdUpdated",
        kind: "nested",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_governance::governor::extensions::governor_counting_simple::GovernorCountingSimpleComponent::Event",
    kind: "enum",
    variants: [],
  },
  {
    type: "event",
    name: "openzeppelin_governance::governor::extensions::governor_timelock_execution::GovernorTimelockExecutionComponent::TimelockUpdated",
    kind: "struct",
    members: [
      {
        name: "old_timelock",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "new_timelock",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_governance::governor::extensions::governor_timelock_execution::GovernorTimelockExecutionComponent::Event",
    kind: "enum",
    variants: [
      {
        name: "TimelockUpdated",
        type: "openzeppelin_governance::governor::extensions::governor_timelock_execution::GovernorTimelockExecutionComponent::TimelockUpdated",
        kind: "nested",
      },
    ],
  },
  {
    type: "event",
    name: "openzeppelin_introspection::src5::SRC5Component::Event",
    kind: "enum",
    variants: [],
  },
  {
    type: "event",
    name: "survivor_governance::governor::SurvivorGovernor::Event",
    kind: "enum",
    variants: [
      {
        name: "GovernorEvent",
        type: "openzeppelin_governance::governor::governor::GovernorComponent::Event",
        kind: "flat",
      },
      {
        name: "GovernorVotesEvent",
        type: "openzeppelin_governance::governor::extensions::governor_votes_quorum_fraction::GovernorVotesQuorumFractionComponent::Event",
        kind: "flat",
      },
      {
        name: "GovernorSettingsEvent",
        type: "openzeppelin_governance::governor::extensions::governor_settings::GovernorSettingsComponent::Event",
        kind: "flat",
      },
      {
        name: "GovernorCountingSimpleEvent",
        type: "openzeppelin_governance::governor::extensions::governor_counting_simple::GovernorCountingSimpleComponent::Event",
        kind: "flat",
      },
      {
        name: "GovernorTimelockExecutionEvent",
        type: "openzeppelin_governance::governor::extensions::governor_timelock_execution::GovernorTimelockExecutionComponent::Event",
        kind: "flat",
      },
      {
        name: "SRC5Event",
        type: "openzeppelin_introspection::src5::SRC5Component::Event",
        kind: "flat",
      },
    ],
  },
];

export default GOVERNOR_ABI;
