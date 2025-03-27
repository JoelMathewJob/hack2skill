"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Phone, Send, Plus, Pencil, Trash2 } from "lucide-react"
import EmergencyPanel from "@/components/emergency-panel"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface EmergencyContact {
  id: string
  name: string
  phone: string
}

interface EmergencyFeaturesProps {
  currentPosition: [number, number] | null
}

export default function EmergencyFeatures({ currentPosition }: EmergencyFeaturesProps) {
  const [isSending, setIsSending] = useState(false)
  const [isEmergencyMode, setIsEmergencyMode] = useState(false)
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    { id: "1", name: "Coast Guard", phone: "1554" },
    { id: "2", name: "Marine Rescue", phone: "1093" },
    { id: "3", name: "Medical Emergency", phone: "108" }
  ])
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null)
  const [newContact, setNewContact] = useState({ name: "", phone: "" })
  const [isAddingContact, setIsAddingContact] = useState(false)

  const handleSOS = () => {
    setIsSending(true)
    
    // Create custom notification
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-md shadow-lg z-50 max-w-sm';
    notification.innerHTML = `
      <div class="flex items-start gap-2">
        <div><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg></div>
        <div>
          <h4 class="font-medium mb-1">SOS Signal Activated</h4>
          <p class="text-sm opacity-90">Emergency services have been notified of your location. Stay calm and wait for assistance.</p>
        </div>
      </div>
    `;
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
      notification.classList.add('opacity-0', 'transition-opacity', 'duration-500');
      setTimeout(() => notification.remove(), 500);
    }, 5000);
    
    // Simulate sending SOS
    setTimeout(() => {
      setIsSending(false);
      setIsEmergencyMode(true);
    }, 2000);
  }

  const handleCancelEmergency = () => {
    setIsEmergencyMode(false);
  }

  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      setContacts([...contacts, { 
        id: Date.now().toString(), 
        name: newContact.name, 
        phone: newContact.phone 
      }]);
      setNewContact({ name: "", phone: "" });
      setIsAddingContact(false);
    }
  }

  const handleEditContact = (contact: EmergencyContact) => {
    setEditingContact(contact);
  }

  const handleUpdateContact = () => {
    if (editingContact && editingContact.name && editingContact.phone) {
      setContacts(contacts.map(c => 
        c.id === editingContact.id ? editingContact : c
      ));
      setEditingContact(null);
    }
  }

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
  }

  // If in emergency mode, show the emergency panel
  if (isEmergencyMode) {
    return <EmergencyPanel position={currentPosition} onCancel={handleCancelEmergency} />;
  }

  // Otherwise show the regular emergency features
  return (
    <div className="space-y-4">
      <Card className="border-red-200">
        <CardHeader className="bg-red-50 dark:bg-red-900/20">
          <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangle className="h-5 w-5" />
            Emergency SOS
          </CardTitle>
          <CardDescription>
            Send distress signal with your current location
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-sm mb-4">
            Activating SOS will send your coordinates and vessel information to nearby coast guard and rescue services.
          </p>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Latitude</span>
              <span className="font-mono">{currentPosition ? currentPosition[0].toFixed(4) : "--"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Longitude</span>
              <span className="font-mono">{currentPosition ? currentPosition[1].toFixed(4) : "--"}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="destructive" 
            className="w-full gap-2" 
            onClick={handleSOS}
            disabled={isSending || !currentPosition}
          >
            {isSending ? (
              <span className="animate-pulse">Sending SOS</span>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Activate SOS
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">Emergency Contacts</CardTitle>
          <Dialog open={isAddingContact} onOpenChange={setIsAddingContact}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Plus className="h-3.5 w-3.5" />
                <span>Add</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Emergency Contact</DialogTitle>
                <DialogDescription>
                  Add a new emergency contact to your list.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={newContact.name} 
                    onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                    placeholder="Contact name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={newContact.phone} 
                    onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                    placeholder="Phone number"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingContact(false)}>Cancel</Button>
                <Button onClick={handleAddContact}>Add Contact</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {contacts.map(contact => (
              <div key={contact.id} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{contact.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" className="h-8">
                    {contact.phone}
                  </Button>
                  <Dialog open={editingContact?.id === contact.id} onOpenChange={(open) => !open && setEditingContact(null)}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditContact(contact)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Contact</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="edit-name">Name</Label>
                          <Input 
                            id="edit-name" 
                            value={editingContact?.name || ""} 
                            onChange={(e) => editingContact && setEditingContact({...editingContact, name: e.target.value})}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="edit-phone">Phone Number</Label>
                          <Input 
                            id="edit-phone" 
                            value={editingContact?.phone || ""} 
                            onChange={(e) => editingContact && setEditingContact({...editingContact, phone: e.target.value})}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingContact(null)}>Cancel</Button>
                        <Button onClick={handleUpdateContact}>Save Changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-red-500" 
                    onClick={() => handleDeleteContact(contact.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Add styles for the notification */}
      <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .fixed.bottom-4 {
          animation: slideIn 0.3s ease-out forwards;
        }
        .opacity-0 {
          opacity: 0;
        }
      `}</style>
    </div>
  )
}

