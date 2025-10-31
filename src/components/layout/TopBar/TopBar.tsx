"use client";

import { Search, Bell, User } from "lucide-react";
import { Button } from "../../ui/button";

export default function TopNavbar() {
  return (
    <header className="bg-white border-b border-gray-200  px-6 py-4 ">
      <div className="flex items-center justify-between">

        <div className="w-full max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search resources, modules, or students..."
            aria-label="Search"
            className="w-full h-10 pl-10 pr-4 rounded-md border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="flex items-center space-x-4 ml-4">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            className="hover:bg-gray-100"
          >
            <Bell className="h-5 w-5 text-gray-600" />
          </Button>


          <Button
            variant="ghost"
            size="icon"
            aria-label="User Profile"
            className="hover:bg-gray-100"
          >
            <User className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
      </div>
    </header>
  );
}
