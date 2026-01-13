import { useEffect, useState } from 'react';
import * as db from '../lib/db';

export function useProposals() {
  const [proposals, setProposals] = useState<Awaited<ReturnType<typeof db.getProposals>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    db.getProposals()
      .then(setProposals)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { proposals, loading, error, refetch: () => db.getProposals().then(setProposals) };
}

export function useProposal(proposalId: string | undefined) {
  const [proposal, setProposal] = useState<Awaited<ReturnType<typeof db.getProposalById>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!proposalId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    db.getProposalById(proposalId)
      .then(setProposal)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [proposalId]);

  return { proposal, loading, error };
}

export function useProposalVotes(proposalId: string | undefined) {
  const [votes, setVotes] = useState<Awaited<ReturnType<typeof db.getVotesForProposal>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!proposalId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    db.getVotesForProposal(proposalId)
      .then(setVotes)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [proposalId]);

  return { votes, loading, error };
}

export function useTopDelegates(limit: number = 10) {
  const [delegates, setDelegates] = useState<Awaited<ReturnType<typeof db.getTopDelegates>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    db.getTopDelegates(limit)
      .then(setDelegates)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [limit]);

  return { delegates, loading, error };
}

export function useDelegation(address: string | undefined) {
  const [delegation, setDelegation] = useState<Awaited<ReturnType<typeof db.getDelegationByAddress>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!address) {
      setLoading(false);
      return;
    }

    setLoading(true);
    db.getDelegationByAddress(address)
      .then(setDelegation)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [address]);

  return { delegation, loading, error };
}

export function useVotingPower(address: string | undefined) {
  const [votingPower, setVotingPower] = useState<Awaited<ReturnType<typeof db.getDelegateVotingPower>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!address) {
      setLoading(false);
      return;
    }

    setLoading(true);
    db.getDelegateVotingPower(address)
      .then(setVotingPower)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [address]);

  return { votingPower, loading, error };
}
