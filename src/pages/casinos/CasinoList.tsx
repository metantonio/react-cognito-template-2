import { useState, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
// Update the import path if the services folder is at 'src/services'
// Update the path below if your casinoService file is in a different location
import { getCasinos } from '../../services/casinos';

function CasinoList() {
	const [casinos, setCasinos] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [contentFilter, setContentFilter] = useState("all");
	const [contentEnabled, setContentEnabled] = useState({});

	useEffect(() => {
		getCasinos().then(res => {
			const mapped = (res.data || []).map((casino) => ({
				id: casino.casino_id,
				name: casino.casino_name,
				category: casino.category,
				subcategories: casino.subcategories,
				// Fix image path for display
				image: `http://localhost:5000/${casino.image.replace(/\\/g, '/')}`,
				location: casino.address,
				latitude: casino.latitude,
				longitude: casino.longitude,
				createdAt: casino.created_at,
				// Use Contact field from backend
				contact: casino.Contact || '',
				email: casino.email || '',
				phone: casino.phone || '',
				status: casino.status || 'Active'
			}));
			setCasinos(mapped);
			console.log(mapped.image);
			const initial = {};
			mapped.forEach((casino) => {
				initial[casino.id] = true; // use boolean, not "active"
			});
			setContentEnabled(initial);
		});
	}, []);

	const filteredCasinos = casinos.filter((casino) => {
		const matchesSearch =
			casino.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(casino.email && casino.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
			(casino.phone && casino.phone.includes(searchTerm));
		const matchesStatus = statusFilter === "all" || (casino.status && casino.status.toLowerCase() === statusFilter);
		let matchesContent = true;
		if (contentFilter === "enable") matchesContent = contentEnabled[casino.id];
		else if (contentFilter === "disable") matchesContent = !contentEnabled[casino.id];

		return matchesSearch && matchesStatus && matchesContent;
	});

	return (
		<div className="min-h-screen bg-gray-50">
			<header className="bg-white border-b border-gray-200 px-6 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div>
							<h1 className="text-2xl font-bold text-navy-500">Casinos</h1>
							<p className="text-gray-600">Manage your casino properties</p>
						</div>
					</div>
					<Link to="/adminpanel/casinos/create">
						<Button className="bg-navy-500 hover:bg-navy-600 text-white">
							<Plus className="w-4 h-4 mr-2" />
							Add New Casino
						</Button>
					</Link>
				</div>
			</header>

			<main className="p-6">
				<Card>
					<CardHeader>
						<CardTitle className="text-navy-600">Casino Management</CardTitle>
						<CardDescription>View and manage all casino properties</CardDescription>
					</CardHeader>
					<CardContent>
						{/* Filters */}
						<div className="flex flex-col md:flex-row gap-4 mb-6">
							<div className="relative flex-1">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
								<Input
									placeholder="Search by name, email, or phone..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10"
								/>
							</div>
							<Select value={statusFilter} onValueChange={setStatusFilter}>
								<SelectTrigger className="w-full md:w-40">
									<SelectValue placeholder="Status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Status</SelectItem>
									<SelectItem value="active">Active</SelectItem>
									<SelectItem value="inactive">Inactive</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Table */}
						<div className="border rounded-lg overflow-hidden">
							<Table>
								<TableHeader className="bg-gray-50">
									<TableRow>
										<TableHead>Casino</TableHead>
										<TableHead>Category</TableHead>
										<TableHead>Location</TableHead>
										<TableHead>Contact</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className="w-12">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredCasinos.map((casino) => (
										<TableRow key={casino.id} className="hover:bg-gray-50">
											<TableCell>
												<div className="flex items-center gap-3">
													<Avatar className="w-10 h-10">
														<AvatarImage src={casino.image} alt={casino.name} />
														<AvatarFallback className="bg-navy-100 text-navy-600">
															{casino.name.substring(0, 2).toUpperCase()}
														</AvatarFallback>
													</Avatar>
													<div className="flex items-center gap-2">
														<Link
															to={`/adminpanel/casinos/${casino.id}/view`}
															className="font-medium text-navy-600 hover:underline cursor-pointer"
															title="View details"
														>
															{casino.name}
														</Link>
														<button
															onClick={() => navigator.clipboard.writeText(casino.name)}
															title="Copy casino name"
															className="ml-1 text-gray-400 hover:text-navy-600 focus:outline-none"
															style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																width="16"
																height="16"
																fill="none"
																viewBox="0 0 24 24"
																stroke="currentColor"
															>
																<rect x="9" y="9" width="13" height="13" rx="2" strokeWidth="2" />
																<rect x="3" y="3" width="13" height="13" rx="2" strokeWidth="2" />
															</svg>
														</button>
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div>
													<p className="font-medium">{casino.category}</p>
													{/* <p className="text-sm text-gray-500">{casino.subcategory}</p> */}
												</div>
											</TableCell>
											<TableCell className="text-gray-600">{casino.location}</TableCell>
											<TableCell>
												<div>
													<p className="text-sm">{casino.contact}</p>
													<p className="text-sm text-gray-500">{casino.phone}</p>
												</div>
											</TableCell>
											{/* <TableCell>
												<Badge
													variant={casino.status === "Active" ? "default" : "secondary"}
													className={casino.status === "Active" ? "bg-casino-green text-white" : ""}
												>
													{casino.status}
												</Badge>
											</TableCell> */}
											<TableCell>
												<Switch
													checked={casino.status === "active"}
													onCheckedChange={(checked) => {
														setCasinos((prev) =>
															prev.map((c) =>
																c.id === casino.id
																	? { ...c, status: checked ? "active" : "inactive" }
																	: c
															)
														);
														// Optional: send status update to backend here
													}}
													aria-label={casino.status === "active" ? "Enabled" : "Disabled"}
												/>
											</TableCell>
											<TableCell>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" size="icon" className="h-8 w-8">
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end" className="bg-white border shadow-lg">
														<DropdownMenuItem asChild>
															<Link
																to={`/adminpanel/casinos/${casino.id}/update`}
																className="flex items-center gap-2 cursor-pointer"
															>
																<Save className="h-4 w-4" />
																Save
															</Link>
														</DropdownMenuItem>
														{/* <DropdownMenuItem asChild>
															<Link
																to={`/adminpanel/casinos/${casino.id}`}
																className="flex items-center gap-2 cursor-pointer"
															>
																<Edit className="h-4 w-4" />
																Edit
															</Link>
														</DropdownMenuItem> */}
														<DropdownMenuItem className="flex items-center gap-2 text-red-600">
															<Trash2 className="h-4 w-4" />
															Delete
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>

						{filteredCasinos.length === 0 && (
							<div className="text-center py-8">
								<p className="text-gray-500">No casinos found matching your criteria.</p>
							</div>
						)}
					</CardContent>
				</Card>
			</main>
		</div>
	);
};

export default CasinoList;
