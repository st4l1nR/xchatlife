"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import clsx from "clsx";
import { Plus } from "lucide-react";
import { Button } from "@/app/_components/atoms/button";
import { Input } from "@/app/_components/atoms/input";
import {
  Listbox,
  ListboxOption,
  ListboxLabel,
} from "@/app/_components/atoms/listbox";
import ListCardRole from "@/app/_components/organisms/ListCardRole";
import TableUser from "@/app/_components/organisms/TableUser";
import DialogCreateUpdateRole from "@/app/_components/organisms/DialogCreateUpdateRole";
import DialogCreateUpdateUser from "@/app/_components/organisms/DialogCreateUpdateUser";
import { api } from "@/trpc/react";
import type { CardRoleProps } from "@/app/_components/molecules/CardRole";
import type { TableUserItem } from "@/app/_components/organisms/TableUser";
import type {
  ExistingRole,
  RolePermissions,
} from "@/app/_components/organisms/DialogCreateUpdateRole";
import type { ExistingUser } from "@/app/_components/organisms/DialogCreateUpdateUser";

export type DashboardRolesPageMockData = {
  roles: CardRoleProps[];
  users: TableUserItem[];
  pagination: {
    page: number;
    total: number;
    totalPage: number;
    size: number;
  };
};

export type DashboardRolesPageProps = {
  className?: string;
  mock?: DashboardRolesPageMockData;
};

// Default mock data for development and Storybook
export const defaultMockData: DashboardRolesPageMockData = {
  roles: [
    {
      roleName: "Administrator",
      totalUsers: 4,
      users: [
        { id: "1", name: "John Doe", avatarSrc: "/images/girl-poster.webp" },
        { id: "2", name: "Jane Smith", avatarSrc: "/images/girl-poster.webp" },
        { id: "3", name: "Bob Wilson", avatarSrc: "/images/girl-poster.webp" },
        { id: "4", name: "Alice Brown", avatarSrc: "/images/girl-poster.webp" },
      ],
    },
    {
      roleName: "Editor",
      totalUsers: 7,
      users: [
        {
          id: "5",
          name: "Charlie Davis",
          avatarSrc: "/images/girl-poster.webp",
        },
        {
          id: "6",
          name: "Diana Miller",
          avatarSrc: "/images/girl-poster.webp",
        },
        { id: "7", name: "Eve Johnson", avatarSrc: "/images/girl-poster.webp" },
      ],
    },
    {
      roleName: "Users",
      totalUsers: 5,
      users: [
        { id: "8", name: "Frank White", avatarSrc: "/images/girl-poster.webp" },
        { id: "9", name: "Grace Lee", avatarSrc: "/images/girl-poster.webp" },
      ],
    },
    {
      roleName: "Support",
      totalUsers: 6,
      users: [
        {
          id: "10",
          name: "Henry Taylor",
          avatarSrc: "/images/girl-poster.webp",
        },
        { id: "11", name: "Ivy Clark", avatarSrc: "/images/girl-poster.webp" },
        { id: "12", name: "Jack Moore", avatarSrc: "/images/girl-poster.webp" },
      ],
    },
    {
      roleName: "Restricted User",
      totalUsers: 10,
      users: [
        {
          id: "13",
          name: "Kate Anderson",
          avatarSrc: "/images/girl-poster.webp",
        },
        {
          id: "14",
          name: "Leo Martinez",
          avatarSrc: "/images/girl-poster.webp",
        },
        { id: "15", name: "Mia Garcia", avatarSrc: "/images/girl-poster.webp" },
      ],
    },
  ],
  users: [
    {
      id: "1",
      name: "Jordan Stevenson",
      username: "jordan.stevenson",
      avatarSrc: "/images/girl-poster.webp",
      customRoleName: "Admin",
      subscription: "yearly",
      status: "pending",
    },
    {
      id: "2",
      name: "Richard Payne",
      username: "richard247",
      avatarSrc: "/images/girl-poster.webp",
      customRoleName: "Admin",
      subscription: "monthly",
      status: "active",
    },
    {
      id: "3",
      name: "Jennifer Summers",
      username: "summers.45",
      avatarSrc: "/images/girl-poster.webp",
      customRoleName: "Customer",
      subscription: "yearly",
      status: "active",
    },
    {
      id: "4",
      name: "Mr. Justin Richardson",
      username: "jr.3734",
      avatarSrc: "/images/girl-poster.webp",
      customRoleName: "Admin",
      subscription: "monthly",
      status: "pending",
    },
    {
      id: "5",
      name: "Nicholas Tanner",
      username: "nicholas.t",
      avatarSrc: "/images/girl-poster.webp",
      customRoleName: "Superadmin",
      subscription: "yearly",
      status: "active",
    },
    {
      id: "6",
      name: "Crystal Mays",
      username: "mays.754",
      avatarSrc: "/images/girl-poster.webp",
      customRoleName: "Admin",
      subscription: "none",
      status: "pending",
    },
    {
      id: "7",
      name: "Mary Garcia",
      username: "mary.garcia",
      avatarSrc: "/images/girl-poster.webp",
      customRoleName: "Superadmin",
      subscription: "monthly",
      status: "inactive",
    },
    {
      id: "8",
      name: "Megan Roberts",
      username: "roberts.3456",
      avatarSrc: "/images/girl-poster.webp",
      customRoleName: "Customer",
      subscription: "yearly",
      status: "active",
    },
    {
      id: "9",
      name: "Joseph Oliver",
      username: "joseph.87",
      avatarSrc: "/images/girl-poster.webp",
      customRoleName: "Customer",
      subscription: "none",
      status: "pending",
    },
  ],
  pagination: {
    page: 1,
    total: 50,
    totalPage: 5,
    size: 10,
  },
};

const DashboardRolesPage: React.FC<DashboardRolesPageProps> = ({
  className,
  mock,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State for dialogs
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [roleDialogMode, setRoleDialogMode] = useState<"create" | "update">(
    "create",
  );
  const [userDialogMode, setUserDialogMode] = useState<"create" | "update">(
    "create",
  );
  const [selectedRole, setSelectedRole] = useState<ExistingRole | undefined>();
  const [selectedUser, setSelectedUser] = useState<ExistingUser | undefined>();

  // State for table
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);

  // Open create role dialog if ?create=true is in URL
  useEffect(() => {
    if (searchParams.get("create") === "true") {
      setSelectedRole(undefined);
      setRoleDialogMode("create");
      setRoleDialogOpen(true);
      // Remove the query parameter from URL
      router.replace("/dashboard/roles", { scroll: false });
    }
  }, [searchParams, router]);

  // API calls (disabled when mock is provided)
  const { data: rolesData, isLoading: rolesLoading } = api.role.getAll.useQuery(
    undefined,
    { enabled: !mock },
  );

  const { data: usersData, isLoading: usersLoading } =
    api.admin.getUsers.useQuery(
      {
        page: pageSize === -1 ? 1 : page,
        limit: pageSize === -1 ? 100 : pageSize,
        search: searchQuery || undefined,
        customRoleId: roleFilter || undefined,
      },
      { enabled: !mock },
    );

  // Use mock data or API data
  const roles: CardRoleProps[] =
    mock?.roles ??
    (rolesData?.data ?? []).map((role) => ({
      roleName: role.name,
      totalUsers: role.userCount,
      users: role.users ?? [],
    }));

  const users: TableUserItem[] =
    mock?.users ??
    (usersData?.data?.users ?? []).map((user) => ({
      id: user.id,
      name: user.name,
      username: user.email,
      avatarSrc: user.image ?? undefined,
      customRoleName: user.customRole?.name,
      subscription: "none" as const,
      status: user.emailVerified ? ("active" as const) : ("pending" as const),
    }));

  const pagination = mock?.pagination ?? {
    page: usersData?.data?.pagination?.page ?? 1,
    total: usersData?.data?.pagination?.total ?? 0,
    totalPage: usersData?.data?.pagination?.totalPages ?? 1,
    size: usersData?.data?.pagination?.limit ?? 10,
  };

  // Event handlers
  const handleAddNewRole = () => {
    setSelectedRole(undefined);
    setRoleDialogMode("create");
    setRoleDialogOpen(true);
  };

  const handleEditRole = (role: CardRoleProps, index: number) => {
    // Find the full role data from API response
    const fullRole = rolesData?.data?.[index];
    if (fullRole) {
      setSelectedRole({
        id: fullRole.id,
        name: fullRole.name,
        permissions: fullRole.permissions as RolePermissions,
      });
      setRoleDialogMode("update");
      setRoleDialogOpen(true);
    }
  };

  const handleCopyRole = (role: CardRoleProps, index: number) => {
    // Find the full role data and open create dialog with pre-filled data
    const fullRole = rolesData?.data?.[index];
    if (fullRole) {
      setSelectedRole({
        id: "", // Empty ID for create mode
        name: `${fullRole.name} (Copy)`,
        permissions: fullRole.permissions as RolePermissions,
      });
      setRoleDialogMode("create");
      setRoleDialogOpen(true);
    }
  };

  const handleAddNewUser = () => {
    setSelectedUser(undefined);
    setUserDialogMode("create");
    setUserDialogOpen(true);
  };

  const handleViewUser = (id: string) => {
    // Find the user and open edit dialog
    const user = usersData?.data?.users?.find((u) => u.id === id);
    if (user) {
      setSelectedUser({
        id: user.id,
        firstName: user.name.split(" ")[0] ?? "",
        lastName: user.name.split(" ").slice(1).join(" ") ?? "",
        email: user.email,
        roleId: user.customRole?.id ?? "",
        roleName: user.customRole?.name,
      });
      setUserDialogMode("update");
      setUserDialogOpen(true);
    }
  };

  const handleDeleteUser = (id: string) => {
    // TODO: Implement delete user functionality
    console.log("Delete user:", id);
  };

  return (
    <div className={clsx("space-y-8", className)}>
      {/* Roles Section */}
      <section>
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-foreground text-2xl font-semibold">
              Roles List
            </h1>
            <p className="text-muted-foreground mt-1 max-w-3xl">
              A role provided access to predefined menus and features so that
              depending on assigned role an administrator can have access to
              what he need
            </p>
          </div>
          <Button onClick={handleAddNewRole}>
            <Plus data-slot="icon" />
            Add New Role
          </Button>
        </div>

        <ListCardRole
          roles={roles}
          loading={rolesLoading && !mock}
          onEditRole={handleEditRole}
          onCopyRole={handleCopyRole}
        />
      </section>

      {/* Users Section */}
      <section>
        <div className="mb-6">
          <h2 className="text-foreground text-2xl font-semibold">
            Total users with their roles
          </h2>
          <p className="text-muted-foreground mt-1">
            Find all of your company&apos;s administrator accounts and their
            associate roles.
          </p>
        </div>

        {/* Controls */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Listbox value={pageSize} onChange={setPageSize}>
              <ListboxOption value={-1}>
                <ListboxLabel>All</ListboxLabel>
              </ListboxOption>
              <ListboxOption value={10}>
                <ListboxLabel>10</ListboxLabel>
              </ListboxOption>
              <ListboxOption value={25}>
                <ListboxLabel>25</ListboxLabel>
              </ListboxOption>
              <ListboxOption value={50}>
                <ListboxLabel>50</ListboxLabel>
              </ListboxOption>
            </Listbox>

            <Listbox
              value={roleFilter}
              onChange={(value) => {
                setRoleFilter(value);
                setPage(1); // Reset to first page when filter changes
              }}
            >
              <ListboxOption value={null}>
                <ListboxLabel>All Roles</ListboxLabel>
              </ListboxOption>
              {!mock &&
                rolesData?.data?.map((role) => (
                  <ListboxOption key={role.id} value={role.name}>
                    <ListboxLabel>{role.name}</ListboxLabel>
                  </ListboxOption>
                ))}
            </Listbox>
          </div>

          <div className="flex items-center gap-3">
            <Input
              type="search"
              placeholder="Search User"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button className="shrink-0" onClick={handleAddNewUser}>
              <Plus data-slot="icon" />
              Invite New User
            </Button>
          </div>
        </div>

        <TableUser
          data={users}
          loading={usersLoading && !mock}
          totalDocs={pagination.total}
          pagination={pagination}
          onPageChange={setPage}
          onView={handleViewUser}
          onDelete={handleDeleteUser}
        />
      </section>

      {/* Dialogs */}
      <DialogCreateUpdateRole
        open={roleDialogOpen}
        onClose={() => setRoleDialogOpen(false)}
        mode={roleDialogMode}
        existingRole={selectedRole}
      />

      <DialogCreateUpdateUser
        open={userDialogOpen}
        onClose={() => setUserDialogOpen(false)}
        mode={userDialogMode}
        existingUser={selectedUser}
      />
    </div>
  );
};

export default DashboardRolesPage;
