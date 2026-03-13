import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { projectApiCalls } from "@/lib/apiCalls/projectApis"
import { useEffect, useState } from "react"
import { log } from "console"

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
]





function ProjectTable({ allProjects, deleteProject, view }: any) {

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
                <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => view(project.id)}>View</Button>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">Edit</Button>
                <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={() => deleteProject(project.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default ProjectTable