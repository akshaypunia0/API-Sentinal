import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import AlertDialogDestructive from "../other/AlertDialog";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";



function ProjectTable({ allProjects, deleteProject, view, onDelete }: any) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);

  console.log("All projects inside table: ", allProjects);

  return (
    <div>
      <Table>
        <TableCaption>A list of your projects</TableCaption>
        <TableHeader>
          <TableRow className="text-[17px] font-bold">
            <TableHead className="w-25">Name</TableHead>
            <TableHead>Total APis</TableHead>
            <TableHead>Created date</TableHead>
            <TableHead>Updated date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allProjects.map((project: any) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium w-2xs">{project.name}</TableCell>
              <TableCell>{project._count.apis}</TableCell>
              <TableCell>{(project.createdAt).split("T")[0]}</TableCell>
              <TableCell>{(project.updatedAt).split("T")[0]}</TableCell>
              <TableCell className="text-right flex justify-end gap-2">
                <Button
                  onClick={() => view(project.id)}
                  className="bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 hover:text-blue-300 transition-all duration-200 px-3 py-1.5 text-sm rounded-md"
                >
                  View
                </Button>

                {/* DELETE */}
                <Button
                  onClick={() => setDeleteDialogOpen(project.id)}
                  className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 px-3 py-1.5 text-sm rounded-md"
                >
                  Delete
                </Button>
                <AlertDialogDestructive
                  icon={<Trash2Icon />}
                  title="Delete Project"
                  description="Are you sure you want to delete this project?"
                  id={project.id}
                  open={deleteDialogOpen === project.id}
                  onOpenChange={(isOpen: boolean) => {
                    if (!isOpen) setDeleteDialogOpen(null);
                  }}
                  onSubmit={() => onDelete(project.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default ProjectTable