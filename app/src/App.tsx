import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { server } from "./services/axiosInstance";
import { Poll } from "./types/poll";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { NewPollForm } from "./components/NewPollForm";
import { useTenant } from "./context/TenantContext";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { getPollStatus } from "./functions/functions";

function App() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [totalApartments, setTotalApartments] = useState(0);
  const { tenant } = useTenant();

  useEffect(() => {
    async function fetchPolls() {
      try {
        const res = await server.get("/polls");
        setPolls(res.data.polls);
        setTotalApartments(res.data.totalApartments);
      } catch (error) {
        console.error("Failed to fetch polls", error);
      }
    }

    fetchPolls();
  }, []);

  return (
    <>
      <Card className="bg-white/90">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center">
            <CardTitle className="font-bold text-2xl text-primary">
              Polls
            </CardTitle>
            <NewPollForm />
          </div>
        </CardHeader>

        <CardContent>
          {polls.length === 0 ? (
            <p>No polls were taken yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Poll Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Votes</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {polls.map((poll) => {
                  const status = getPollStatus(poll, tenant);

                  return (
                    <TableRow key={poll.id}>
                      <TableCell className="font-medium">
                        <Link to={`/polls/${poll.id}`}>{poll.title}</Link>
                      </TableCell>
                      <TableCell className={status.color}>
                        {status.status}
                      </TableCell>
                      <TableCell>
                        {poll.cost == 0 ? "No Cost" : poll.cost}
                      </TableCell>
                      <TableCell>
                        {poll.votes?.length} / {totalApartments}
                      </TableCell>
                      <TableCell>
                        {new Date(poll.deadline).toLocaleDateString("en-GB")}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}

export default App;
