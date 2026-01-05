import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card';

const paymentsData = [
  {
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    avatar: 'https://api.slingacademy.com/public/sample-users/1.png',
    fallback: 'OM',
    amount: '+$1,999.00',
    description: 'Tuition Fee - Term 1'
  },
  {
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    avatar: 'https://api.slingacademy.com/public/sample-users/2.png',
    fallback: 'JL',
    amount: '+$39.00',
    description: 'Library Fine'
  },
  {
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    avatar: 'https://api.slingacademy.com/public/sample-users/3.png',
    fallback: 'IN',
    amount: '+$299.00',
    description: 'Lab Materials'
  },
  {
    name: 'William Kim',
    email: 'will@email.com',
    avatar: 'https://api.slingacademy.com/public/sample-users/4.png',
    fallback: 'WK',
    amount: '+$99.00',
    description: 'Sports Equipment'
  },
  {
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    avatar: 'https://api.slingacademy.com/public/sample-users/5.png',
    fallback: 'SD',
    amount: '+$39.00',
    description: 'Uniform'
  }
];

export function RecentPayments() {
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>Recent Payments</CardTitle>
        <CardDescription>Latest financial transactions from students.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-8'>
          {paymentsData.map((payment, index) => (
            <div key={index} className='flex items-center'>
              <Avatar className='h-9 w-9'>
                <AvatarImage src={payment.avatar} alt='Avatar' />
                <AvatarFallback>{payment.fallback}</AvatarFallback>
              </Avatar>
              <div className='ml-4 space-y-1'>
                <p className='text-sm leading-none font-medium'>{payment.name}</p>
                <p className='text-muted-foreground text-xs'>{payment.description}</p>
              </div>
              <div className='ml-auto font-medium text-sm'>{payment.amount}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
