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
import { Trash } from "lucide-react";
import { Button } from "./components/ui/button";

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

  const handleDelete = async (id: number) => {
    try {
      await server.delete(`/polls/${id}`);
      setPolls((prevPolls) => prevPolls.filter((poll) => poll.id !== id));
    } catch (error) {
      console.error("Failed to delete poll", error);
    }
  };

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
            <p>No polls were created yet.</p>
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
                      <TableCell className="font-medium whitespace-nowrap">
                        <Link to={`/polls/${poll.id}`}>{poll.title}</Link>
                      </TableCell>
                      <TableCell className={status.color}>
                        {status.status}
                      </TableCell>
                      <TableCell>
                        {poll.cost == 0 ? "No Cost" : poll.cost}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {poll.votes?.length} / {totalApartments}
                      </TableCell>
                      <TableCell>
                        {new Date(poll.deadline).toLocaleDateString("en-GB")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(poll.id!)}
                          aria-label="Delete poll"
                        >
                          <Trash />
                        </Button>
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
