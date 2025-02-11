import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { server } from "../services/axiosInstance";
import { Poll } from "../types/poll";
import { Vote } from "../types/vote";

export function PollPage() {
    const { id } = useParams();
    const [poll, setPoll] = useState<Poll | null>(null);
    const [submittedVote, setSubmittedVote] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchPoll() {
            try {
                const res = await server.get(`/polls/${id}`);
                setPoll(res.data);
            } catch (error) {
                console.error("Failed to fetch poll data:", error);
            }
        }

        if (id) fetchPoll();
    }, [id]);

    const handleVote = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSubmittedVote(e.target.value);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!id) throw Error("couldn't find ID in params.");

        const vote: Vote = {
            pollID: Number(id),
            apartment: 48,
            vote: submittedVote
        }

        console.log("Sending user vote to server:", submittedVote);

        try {
            await server.post(`/polls/${id}/votes`, vote);
        } catch (error) {
            console.error("Failed to save the vote", error);
        }
    }

    { if (!poll) return (<><h1>Poll wasn't found</h1></>) }

    return (
        <>
            <h1>{poll.title}</h1>
            <div className="max-w-[800px] flex flex-col gap-8">

                <div className="flex justify-between">
                    <p>Cost: {poll.cost}</p>
                    <p>Votes: {poll.votes} / 80</p>
                    <p>Deadline: {new Date(poll.deadline).toLocaleDateString("en-GB")}</p>
                </div>

                <p>{poll.details}</p>

                <form className="flex justify-center gap-16">
                    <div className="formField">
                        <input
                            id="voteYes"
                            type="radio"
                            name="vote"
                            value="yes"
                            checked={submittedVote === "yes"}
                            onChange={handleVote}
                        />
                        <label htmlFor="voteYes"> Yes</label>
                    </div>
                    <div className="formField">
                        <input
                            id="voteNo"
                            type="radio"
                            name="vote"
                            value="no"
                            checked={submittedVote === "no"}
                            onChange={handleVote}
                        />
                        <label htmlFor="voteNo"> No</label>
                    </div>
                </form>

                <div className="flex justify-around">
                    <button className="py-1 px-4 rounded destructive" onClick={() => navigate('/')}>Back</button>
                    <button className="py-1 px-4 rounded" disabled={!submittedVote} onClick={handleSubmit}>Save Vote</button>
                </div>

            </div>
        </>
    )
}