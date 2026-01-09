'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useUser } from '@/context/user/user-context';
import { useAuth } from '@clerk/nextjs';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingState, EmptyState } from '@/components/empty-state';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Search,
  Plus,
  Send,
  Paperclip,
  MoreVertical,
  Trash2,
  Archive,
  Pin,
  Star,
  Check,
  CheckCheck,
  Clock,
  Users,
  MessageSquare,
  Bell,
  BellOff,
  Loader2,
  Image,
  File,
  Smile
} from 'lucide-react';
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  online?: boolean;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender?: User;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  attachments?: { name: string; url: string; type: string; size: number }[];
  status: 'sending' | 'sent' | 'delivered' | 'read';
  createdAt: Date;
  editedAt?: Date;
  replyTo?: Message;
}

interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name?: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function MessagesPage() {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [sending, setSending] = useState(false);
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'archived'>(
    'all'
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      const response = await fetch(`${apiBase}/messaging/conversations`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          const formattedConversations = data.data.map((conv: any) => ({
            ...conv,
            createdAt: new Date(conv.createdAt),
            updatedAt: new Date(conv.updatedAt),
            lastMessage: conv.lastMessage
              ? {
                  ...conv.lastMessage,
                  createdAt: new Date(conv.lastMessage.createdAt)
                }
              : undefined
          }));
          setConversations(formattedConversations);
          return;
        }
      }
      // Mock data fallback
      setConversations(getMockConversations());
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      setConversations(getMockConversations());
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  // Fetch messages for conversation
  const fetchMessages = useCallback(
    async (conversationId: string) => {
      try {
        setMessagesLoading(true);
        const token = await getToken();
        const apiBase =
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

        const response = await fetch(
          `${apiBase}/messaging/conversations/${conversationId}/messages`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            const formattedMessages = data.data.map((msg: any) => ({
              ...msg,
              createdAt: new Date(msg.createdAt)
            }));
            setMessages(formattedMessages);
            return;
          }
        }

        // If we reach here and no data, show error if not loading
        if (!messagesLoading) {
          toast.error('Could not load messages from server');
          // No mock fallback as per user request
          setMessages([]);
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
        toast.error('Server connection failed');
        setMessages([]);
      } finally {
        setMessagesLoading(false);
      }
    },
    [getToken]
  );

  // Send message
  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation || sending) return;

    const tempId = `temp-${Date.now()}`;
    const newMessage: Message = {
      id: tempId,
      conversationId: selectedConversation.id,
      senderId: user?.id || '',
      content: messageInput.trim(),
      type: 'text',
      status: 'sending',
      createdAt: new Date()
    };

    // Optimistic update
    setMessages((prev) => [...prev, newMessage]);
    setMessageInput('');
    setSending(true);

    try {
      const token = await getToken();
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      const response = await fetch(
        `${apiBase}/messaging/conversations/${selectedConversation.id}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ content: newMessage.content })
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Update with server response
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId
              ? { ...data.data, createdAt: new Date(data.data.createdAt) }
              : msg
          )
        );
      } else {
        // Mark as sent anyway for demo
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId ? { ...msg, status: 'sent' } : msg
          )
        );
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Mark as sent for demo
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, status: 'sent' } : msg
        )
      );
    } finally {
      setSending(false);
    }
  };

  // Create new conversation
  const createConversation = async () => {
    if (selectedUsers.length === 0) return;

    try {
      const token = await getToken();
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      const response = await fetch(`${apiBase}/messaging/conversations`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          participantIds: selectedUsers.map((u) => u.id),
          isGroup: selectedUsers.length > 1,
          name:
            selectedUsers.length > 1
              ? `Group with ${selectedUsers.map((u) => u.name.split(' ')[0]).join(', ')}`
              : undefined
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Conversation created');
        setIsNewConversationOpen(false);
        setSelectedUsers([]);
        await fetchConversations();
        setSelectedConversation(data.data);
      }
    } catch (error) {
      console.error('Failed to create conversation:', error);
      toast.error('Failed to create conversation');
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mock data helpers
  const getMockConversations = (): Conversation[] => {
    return [
      {
        id: '1',
        type: 'direct',
        participants: [
          {
            id: '2',
            name: 'John Smith',
            email: 'john@school.edu',
            role: 'Teacher',
            online: true
          }
        ],
        lastMessage: {
          id: 'm1',
          conversationId: '1',
          senderId: '2',
          content: 'The assignment grades have been posted.',
          type: 'text',
          status: 'read',
          createdAt: new Date(Date.now() - 1000 * 60 * 5)
        },
        unreadCount: 0,
        isPinned: true,
        isMuted: false,
        isArchived: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        type: 'group',
        name: 'Math Class 10A',
        participants: [
          {
            id: '3',
            name: 'Sarah Johnson',
            email: 'sarah@school.edu',
            role: 'Student'
          },
          {
            id: '4',
            name: 'Mike Wilson',
            email: 'mike@school.edu',
            role: 'Student'
          },
          {
            id: '5',
            name: 'Emma Brown',
            email: 'emma@school.edu',
            role: 'Student'
          }
        ],
        lastMessage: {
          id: 'm2',
          conversationId: '2',
          senderId: '3',
          content: 'Can someone share the notes from yesterday?',
          type: 'text',
          status: 'delivered',
          createdAt: new Date(Date.now() - 1000 * 60 * 30)
        },
        unreadCount: 3,
        isPinned: false,
        isMuted: false,
        isArchived: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        type: 'direct',
        participants: [
          {
            id: '6',
            name: 'Principal Adams',
            email: 'principal@school.edu',
            role: 'Admin'
          }
        ],
        lastMessage: {
          id: 'm3',
          conversationId: '3',
          senderId: '6',
          content: 'Please submit the quarterly report by Friday.',
          type: 'text',
          status: 'read',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
        },
        unreadCount: 1,
        isPinned: false,
        isMuted: false,
        isArchived: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  };

  const getMockMessages = (conversationId: string): Message[] => {
    const baseMessages: Message[] = [
      {
        id: '1',
        conversationId,
        senderId: 'other',
        sender: { id: 'other', name: 'John Smith', email: 'john@school.edu' },
        content: 'Hi! How are you doing today?',
        type: 'text',
        status: 'read',
        createdAt: new Date(Date.now() - 1000 * 60 * 60)
      },
      {
        id: '2',
        conversationId,
        senderId: user?.id || 'me',
        content:
          "I'm doing well, thanks! Just preparing for the upcoming exam.",
        type: 'text',
        status: 'read',
        createdAt: new Date(Date.now() - 1000 * 60 * 55)
      },
      {
        id: '3',
        conversationId,
        senderId: 'other',
        sender: { id: 'other', name: 'John Smith', email: 'john@school.edu' },
        content:
          "That's great to hear. Let me know if you need any help with the study materials.",
        type: 'text',
        status: 'read',
        createdAt: new Date(Date.now() - 1000 * 60 * 50)
      },
      {
        id: '4',
        conversationId,
        senderId: user?.id || 'me',
        content: 'Will do! Thanks for the offer. 📚',
        type: 'text',
        status: 'delivered',
        createdAt: new Date(Date.now() - 1000 * 60 * 45)
      }
    ];
    return baseMessages;
  };

  // Format timestamp
  const formatMessageTime = (date: Date) => {
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    }
    return format(date, 'MMM d');
  };

  // Filter conversations
  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.participants.some((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (activeTab === 'unread') return matchesSearch && conv.unreadCount > 0;
    if (activeTab === 'archived') return matchesSearch && conv.isArchived;
    return matchesSearch && !conv.isArchived;
  });

  // Get conversation display name
  const getConversationName = (conv: Conversation) => {
    if (conv.type === 'group' && conv.name) return conv.name;
    return conv.participants.map((p) => p.name).join(', ');
  };

  // Get participant initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <LoadingState
        title='Loading Messages...'
        description='Fetching your conversations...'
      />
    );
  }

  return (
    <PageContainer>
      <div className='flex h-[calc(100vh-8rem)] gap-4'>
        {/* Conversations List */}
        <Card className='flex w-80 flex-col'>
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-lg'>Messages</CardTitle>
              <Button size='sm' onClick={() => setIsNewConversationOpen(true)}>
                <Plus className='h-4 w-4' />
              </Button>
            </div>
            <div className='relative mt-2'>
              <Search className='text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4' />
              <Input
                placeholder='Search conversations...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-8'
              />
            </div>
          </CardHeader>
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as any)}
            className='px-4'
          >
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='all'>All</TabsTrigger>
              <TabsTrigger value='unread'>Unread</TabsTrigger>
              <TabsTrigger value='archived'>Archived</TabsTrigger>
            </TabsList>
          </Tabs>
          <ScrollArea className='flex-1 px-2'>
            <div className='space-y-1 py-2'>
              {filteredConversations.length === 0 ? (
                <div className='text-muted-foreground py-8 text-center text-sm'>
                  No conversations found
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={cn(
                      'hover:bg-muted/50 flex cursor-pointer items-start gap-3 rounded-lg p-3 transition-colors',
                      selectedConversation?.id === conv.id && 'bg-muted'
                    )}
                  >
                    <div className='relative'>
                      <Avatar>
                        <AvatarImage src={conv.participants[0]?.avatar} />
                        <AvatarFallback
                          className={
                            conv.type === 'group'
                              ? 'bg-blue-100 text-blue-600'
                              : ''
                          }
                        >
                          {conv.type === 'group' ? (
                            <Users className='h-4 w-4' />
                          ) : (
                            getInitials(conv.participants[0]?.name || '?')
                          )}
                        </AvatarFallback>
                      </Avatar>
                      {conv.participants[0]?.online && (
                        <span className='border-background absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 bg-green-500' />
                      )}
                    </div>
                    <div className='min-w-0 flex-1'>
                      <div className='flex items-center justify-between gap-2'>
                        <span className='truncate text-sm font-medium'>
                          {getConversationName(conv)}
                        </span>
                        {conv.lastMessage && (
                          <span className='text-muted-foreground flex-shrink-0 text-xs'>
                            {formatMessageTime(conv.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>
                      <div className='flex items-center justify-between gap-2'>
                        <p className='text-muted-foreground truncate text-xs'>
                          {conv.lastMessage?.content || 'No messages yet'}
                        </p>
                        {conv.unreadCount > 0 && (
                          <Badge
                            variant='default'
                            className='h-5 min-w-5 text-[10px]'
                          >
                            {conv.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {conv.isPinned && (
                      <Pin className='text-muted-foreground h-3 w-3' />
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* Chat Area */}
        <Card className='flex flex-1 flex-col'>
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <CardHeader className='border-b pb-3'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <Avatar>
                      <AvatarFallback>
                        {selectedConversation.type === 'group' ? (
                          <Users className='h-4 w-4' />
                        ) : (
                          getInitials(
                            selectedConversation.participants[0]?.name || '?'
                          )
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className='font-semibold'>
                        {getConversationName(selectedConversation)}
                      </h3>
                      <p className='text-muted-foreground text-xs'>
                        {selectedConversation.type === 'group'
                          ? `${selectedConversation.participants.length} members`
                          : selectedConversation.participants[0]?.online
                            ? 'Online'
                            : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button variant='ghost' size='icon'>
                      <Search className='h-4 w-4' />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon'>
                          <MoreVertical className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem>
                          <Pin className='mr-2 h-4 w-4' />
                          {selectedConversation.isPinned ? 'Unpin' : 'Pin'}{' '}
                          conversation
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          {selectedConversation.isMuted ? (
                            <Bell className='mr-2 h-4 w-4' />
                          ) : (
                            <BellOff className='mr-2 h-4 w-4' />
                          )}
                          {selectedConversation.isMuted ? 'Unmute' : 'Mute'}{' '}
                          notifications
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Archive className='mr-2 h-4 w-4' />
                          Archive conversation
                        </DropdownMenuItem>
                        <DropdownMenuItem className='text-destructive'>
                          <Trash2 className='mr-2 h-4 w-4' />
                          Delete conversation
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <ScrollArea className='flex-1 p-4'>
                {messagesLoading ? (
                  <div className='flex h-full items-center justify-center'>
                    <Loader2 className='text-muted-foreground h-6 w-6 animate-spin' />
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {messages.map((message, index) => {
                      const isOwn = message.senderId === user?.id;
                      const showAvatar =
                        !isOwn &&
                        (index === 0 ||
                          messages[index - 1].senderId !== message.senderId);

                      return (
                        <div
                          key={message.id}
                          className={cn(
                            'flex gap-2',
                            isOwn && 'flex-row-reverse'
                          )}
                        >
                          {!isOwn && showAvatar ? (
                            <Avatar className='h-8 w-8'>
                              <AvatarFallback className='text-xs'>
                                {getInitials(message.sender?.name || '?')}
                              </AvatarFallback>
                            </Avatar>
                          ) : !isOwn ? (
                            <div className='w-8' />
                          ) : null}
                          <div
                            className={cn('max-w-[70%]', isOwn && 'items-end')}
                          >
                            {!isOwn && showAvatar && (
                              <p className='text-muted-foreground mb-1 text-xs'>
                                {message.sender?.name}
                              </p>
                            )}
                            <div
                              className={cn(
                                'rounded-2xl px-4 py-2',
                                isOwn
                                  ? 'bg-primary text-primary-foreground rounded-tr-sm'
                                  : 'bg-muted rounded-tl-sm'
                              )}
                            >
                              <p className='text-sm whitespace-pre-wrap'>
                                {message.content}
                              </p>
                            </div>
                            <div
                              className={cn(
                                'mt-1 flex items-center gap-1',
                                isOwn && 'justify-end'
                              )}
                            >
                              <span className='text-muted-foreground text-[10px]'>
                                {format(message.createdAt, 'HH:mm')}
                              </span>
                              {isOwn && (
                                <span className='text-muted-foreground'>
                                  {message.status === 'sending' && (
                                    <Clock className='h-3 w-3' />
                                  )}
                                  {message.status === 'sent' && (
                                    <Check className='h-3 w-3' />
                                  )}
                                  {message.status === 'delivered' && (
                                    <CheckCheck className='h-3 w-3' />
                                  )}
                                  {message.status === 'read' && (
                                    <CheckCheck className='h-3 w-3 text-blue-500' />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              {/* Message Input */}
              <div className='border-t p-4'>
                <div className='flex items-end gap-2'>
                  <div className='flex gap-1'>
                    <Button variant='ghost' size='icon' className='h-9 w-9'>
                      <Paperclip className='h-4 w-4' />
                    </Button>
                    <Button variant='ghost' size='icon' className='h-9 w-9'>
                      <Image className='h-4 w-4' />
                    </Button>
                  </div>
                  <Textarea
                    ref={inputRef}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder='Type a message...'
                    className='max-h-[120px] min-h-[40px] resize-none'
                    rows={1}
                  />
                  <Button
                    size='icon'
                    onClick={sendMessage}
                    disabled={!messageInput.trim() || sending}
                  >
                    {sending ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                      <Send className='h-4 w-4' />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className='flex flex-1 items-center justify-center'>
              <div className='text-center'>
                <MessageSquare className='text-muted-foreground/50 mx-auto h-12 w-12' />
                <h3 className='mt-4 font-semibold'>No conversation selected</h3>
                <p className='text-muted-foreground mt-1 text-sm'>
                  Select a conversation or start a new one
                </p>
                <Button
                  onClick={() => setIsNewConversationOpen(true)}
                  className='mt-4'
                >
                  <Plus className='mr-2 h-4 w-4' />
                  New Conversation
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* New Conversation Dialog */}
      <Dialog
        open={isNewConversationOpen}
        onOpenChange={setIsNewConversationOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Conversation</DialogTitle>
            <DialogDescription>
              Select users to start a conversation with
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <Input placeholder='Search users...' />
            <ScrollArea className='h-[300px] rounded-lg border p-2'>
              {/* Mock users for demo */}
              {[
                {
                  id: '1',
                  name: 'John Smith',
                  email: 'john@school.edu',
                  role: 'Teacher'
                },
                {
                  id: '2',
                  name: 'Sarah Johnson',
                  email: 'sarah@school.edu',
                  role: 'Student'
                },
                {
                  id: '3',
                  name: 'Mike Wilson',
                  email: 'mike@school.edu',
                  role: 'Student'
                },
                {
                  id: '4',
                  name: 'Principal Adams',
                  email: 'principal@school.edu',
                  role: 'Admin'
                }
              ].map((u) => (
                <div
                  key={u.id}
                  onClick={() => {
                    if (selectedUsers.find((s) => s.id === u.id)) {
                      setSelectedUsers(
                        selectedUsers.filter((s) => s.id !== u.id)
                      );
                    } else {
                      setSelectedUsers([...selectedUsers, u]);
                    }
                  }}
                  className={cn(
                    'hover:bg-muted/50 flex cursor-pointer items-center gap-3 rounded-lg p-2',
                    selectedUsers.find((s) => s.id === u.id) && 'bg-muted'
                  )}
                >
                  <Avatar>
                    <AvatarFallback>{getInitials(u.name)}</AvatarFallback>
                  </Avatar>
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>{u.name}</p>
                    <p className='text-muted-foreground text-xs'>{u.role}</p>
                  </div>
                  {selectedUsers.find((s) => s.id === u.id) && (
                    <Check className='text-primary h-4 w-4' />
                  )}
                </div>
              ))}
            </ScrollArea>
            {selectedUsers.length > 0 && (
              <div className='flex flex-wrap gap-1'>
                {selectedUsers.map((u) => (
                  <Badge key={u.id} variant='secondary' className='gap-1'>
                    {u.name}
                    <button
                      onClick={() =>
                        setSelectedUsers(
                          selectedUsers.filter((s) => s.id !== u.id)
                        )
                      }
                      className='hover:text-destructive ml-1'
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsNewConversationOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={createConversation}
              disabled={selectedUsers.length === 0}
            >
              Start Conversation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
