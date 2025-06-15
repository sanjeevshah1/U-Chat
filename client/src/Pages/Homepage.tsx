import React, { useState } from "react";
import { Contact, Menu, X } from "lucide-react";
import Sidebar from "../Components/Sidebar";
import Chat from "../Components/Chat";
import useChatStore from "../store/useChatStore";
export type FilterOptions = "online" | "all";

export interface sidebarProps {
  filter: FilterOptions;
  isOpen: boolean;
  onClose: () => void;
}

const Homepage = () => {
  const [filter, setFilter] = useState<FilterOptions>("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { selectedChat } = useChatStore();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.checked ? "online" : "all");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="hidden md:flex bg-white px-4 py-3 items-center justify-between lg:px-6">
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            onClick={toggleSidebar}
            className="md:p-2 border-2 border-red-900 rounded-lg text-black hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Contact className="hidden md:block w-6 h-6 text-purple-600" />
          <h1 className="hidden md:block  text-xl font-semibold text-gray-900">
            Contacts
          </h1>
        </div>

        {/* Filter toggle - desktop */}
        <div className="hidden md:flex items-center gap-2">
          <input
            type="checkbox"
            id="online"
            name="online"
            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            onChange={handleChange}
          />
          <label htmlFor="online" className="text-sm text-gray-700">
            Show only online
          </label>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar filter={filter} isOpen={true} onClose={() => {}} />
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
            onClick={closeSidebar}
          />
        )}

        {/* Mobile Sidebar */}
        <div
          className={`md:hidden fixed left-0 top-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Mobile sidebar header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Contact className="w-5 h-5 text-purple-600" />
              <h2 className="font-semibold text-gray-900">Contacts</h2>
            </div>
            <button
              onClick={closeSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile filter */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="online-mobile"
                name="online-mobile"
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                onChange={handleChange}
              />
              <label htmlFor="online-mobile" className="text-sm text-gray-700">
                Show only online
              </label>
            </div>
          </div>

          <Sidebar
            filter={filter}
            isOpen={sidebarOpen}
            onClose={closeSidebar}
          />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 flex items-center justify-center bg-white md:border-l border-gray-200">
          {selectedChat ? (
            <Chat />
          ) : (
            <div className="text-center text-gray-500">
              <Contact className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Select a contact</h3>
              <p className="text-sm">Choose a contact to start chatting</p>

              {/* Mobile: Show contacts button */}
              <button
                onClick={toggleSidebar}
                className="md:hidden mt-6 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                View Contacts
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Homepage;
