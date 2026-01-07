'use client';

import { useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  CreditCard,
  Check,
  X,
  Edit,
  Save,
  Package,
  DollarSign,
  Users,
  Zap,
  Crown,
  Building,
  Infinity
} from 'lucide-react';
import { PACKAGE_PRICING } from '@/config/superadmin';
import type { PackagePricing } from '@/types/superadmin';

export default function PricingManagement() {
  const [packages, setPackages] =
    useState<Record<string, PackagePricing>>(PACKAGE_PRICING);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackagePricing | null>(
    null
  );

  const handleEditPackage = (tier: string) => {
    setSelectedPackage(tier);
    setEditingPackage({ ...packages[tier] });
    setIsEditDialogOpen(true);
  };

  const handleSavePackage = () => {
    if (editingPackage && selectedPackage) {
      setPackages({
        ...packages,
        [selectedPackage]: editingPackage
      });
      setIsEditDialogOpen(false);
      setEditingPackage(null);
      setSelectedPackage(null);
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'trial':
        return <Zap className='h-6 w-6' />;
      case 'basic':
        return <Package className='h-6 w-6' />;
      case 'standard':
        return <Building className='h-6 w-6' />;
      case 'premium':
        return <Crown className='h-6 w-6' />;
      case 'enterprise':
        return <Infinity className='h-6 w-6' />;
      default:
        return <Package className='h-6 w-6' />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'trial':
        return 'border-gray-200 bg-gray-50';
      case 'basic':
        return 'border-blue-200 bg-blue-50';
      case 'standard':
        return 'border-purple-200 bg-purple-50';
      case 'premium':
        return 'border-amber-200 bg-amber-50';
      case 'enterprise':
        return 'border-emerald-200 bg-emerald-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const formatLimit = (limit: number) => {
    if (limit === -1) return 'Unlimited';
    return limit.toLocaleString();
  };

  return (
    <PageContainer>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='flex items-center gap-2 text-3xl font-bold'>
              <CreditCard className='text-primary h-8 w-8' />
              Pricing & Packages
            </h1>
            <p className='text-muted-foreground mt-1'>
              Manage subscription tiers and pricing
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center gap-3'>
                <div className='bg-primary/10 rounded-lg p-2'>
                  <Package className='text-primary h-5 w-5' />
                </div>
                <div>
                  <div className='text-2xl font-bold'>
                    {Object.keys(packages).length}
                  </div>
                  <p className='text-muted-foreground text-xs'>Active Plans</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center gap-3'>
                <div className='rounded-lg bg-green-100 p-2'>
                  <DollarSign className='h-5 w-5 text-green-600' />
                </div>
                <div>
                  <div className='text-2xl font-bold'>$99-$799</div>
                  <p className='text-muted-foreground text-xs'>Monthly Range</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center gap-3'>
                <div className='rounded-lg bg-purple-100 p-2'>
                  <Crown className='h-5 w-5 text-purple-600' />
                </div>
                <div>
                  <div className='text-2xl font-bold'>Premium</div>
                  <p className='text-muted-foreground text-xs'>Most Popular</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center gap-3'>
                <div className='rounded-lg bg-amber-100 p-2'>
                  <Users className='h-5 w-5 text-amber-600' />
                </div>
                <div>
                  <div className='text-2xl font-bold'>17%</div>
                  <p className='text-muted-foreground text-xs'>
                    Yearly Discount
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Cards */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
          {Object.entries(packages).map(([tier, pkg]) => (
            <Card key={tier} className={`relative ${getTierColor(tier)}`}>
              {tier === 'premium' && (
                <div className='absolute -top-3 left-1/2 -translate-x-1/2'>
                  <Badge className='bg-amber-500 text-white'>
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className='pb-2 text-center'>
                <div className='mx-auto mb-2 rounded-full bg-white p-3 shadow-sm'>
                  {getTierIcon(tier)}
                </div>
                <CardTitle>{pkg.name}</CardTitle>
                <CardDescription className='text-xs'>
                  {pkg.description}
                </CardDescription>
              </CardHeader>
              <CardContent className='text-center'>
                <div className='mb-4'>
                  {pkg.monthlyPrice === 0 && tier === 'enterprise' ? (
                    <div className='text-2xl font-bold'>Custom</div>
                  ) : (
                    <>
                      <div className='text-3xl font-bold'>
                        ${pkg.monthlyPrice}
                        <span className='text-muted-foreground text-sm font-normal'>
                          /mo
                        </span>
                      </div>
                      {pkg.yearlyPrice > 0 && (
                        <div className='text-muted-foreground text-sm'>
                          ${pkg.yearlyPrice}/year
                        </div>
                      )}
                    </>
                  )}
                </div>

                <Separator className='my-4' />

                <div className='space-y-2 text-left text-sm'>
                  <div className='flex items-center gap-2'>
                    <Users className='text-muted-foreground h-4 w-4' />
                    <span>{formatLimit(pkg.maxStudents)} students</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Users className='text-muted-foreground h-4 w-4' />
                    <span>{formatLimit(pkg.maxTeachers)} teachers</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Package className='text-muted-foreground h-4 w-4' />
                    <span>{pkg.modules.length} modules</span>
                  </div>
                </div>

                <Separator className='my-4' />

                <div className='space-y-1 text-left text-xs'>
                  {pkg.features.slice(0, 4).map((feature, i) => (
                    <div key={i} className='flex items-start gap-2'>
                      <Check className='mt-0.5 h-3 w-3 shrink-0 text-green-600' />
                      <span className='text-muted-foreground'>{feature}</span>
                    </div>
                  ))}
                  {pkg.features.length > 4 && (
                    <div className='text-muted-foreground pt-1 text-center'>
                      +{pkg.features.length - 4} more features
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant='outline'
                  className='w-full'
                  onClick={() => handleEditPackage(tier)}
                >
                  <Edit className='mr-2 h-4 w-4' />
                  Edit Plan
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Comparison</CardTitle>
            <CardDescription>Compare features across all plans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b'>
                    <th className='px-4 py-3 text-left font-medium'>Feature</th>
                    {Object.values(packages).map((pkg) => (
                      <th
                        key={pkg.tier}
                        className='px-4 py-3 text-center font-medium'
                      >
                        {pkg.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className='border-b'>
                    <td className='px-4 py-3'>Max Students</td>
                    {Object.values(packages).map((pkg) => (
                      <td key={pkg.tier} className='px-4 py-3 text-center'>
                        {formatLimit(pkg.maxStudents)}
                      </td>
                    ))}
                  </tr>
                  <tr className='border-b'>
                    <td className='px-4 py-3'>Max Teachers</td>
                    {Object.values(packages).map((pkg) => (
                      <td key={pkg.tier} className='px-4 py-3 text-center'>
                        {formatLimit(pkg.maxTeachers)}
                      </td>
                    ))}
                  </tr>
                  <tr className='border-b'>
                    <td className='px-4 py-3'>Custom Branding</td>
                    {Object.values(packages).map((pkg) => (
                      <td key={pkg.tier} className='px-4 py-3 text-center'>
                        {pkg.customBranding ? (
                          <Check className='mx-auto h-5 w-5 text-green-600' />
                        ) : (
                          <X className='mx-auto h-5 w-5 text-gray-300' />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className='border-b'>
                    <td className='px-4 py-3'>API Access</td>
                    {Object.values(packages).map((pkg) => (
                      <td key={pkg.tier} className='px-4 py-3 text-center'>
                        {pkg.apiAccess ? (
                          <Check className='mx-auto h-5 w-5 text-green-600' />
                        ) : (
                          <X className='mx-auto h-5 w-5 text-gray-300' />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className='border-b'>
                    <td className='px-4 py-3'>Advanced Analytics</td>
                    {Object.values(packages).map((pkg) => (
                      <td key={pkg.tier} className='px-4 py-3 text-center'>
                        {pkg.advancedAnalytics ? (
                          <Check className='mx-auto h-5 w-5 text-green-600' />
                        ) : (
                          <X className='mx-auto h-5 w-5 text-gray-300' />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className='border-b'>
                    <td className='px-4 py-3'>White Label</td>
                    {Object.values(packages).map((pkg) => (
                      <td key={pkg.tier} className='px-4 py-3 text-center'>
                        {pkg.whiteLabel ? (
                          <Check className='mx-auto h-5 w-5 text-green-600' />
                        ) : (
                          <X className='mx-auto h-5 w-5 text-gray-300' />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className='px-4 py-3'>Support Level</td>
                    {Object.values(packages).map((pkg) => (
                      <td
                        key={pkg.tier}
                        className='px-4 py-3 text-center capitalize'
                      >
                        {pkg.supportLevel}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Package Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-[600px]'>
            {editingPackage && (
              <>
                <DialogHeader>
                  <DialogTitle>Edit {editingPackage.name} Plan</DialogTitle>
                  <DialogDescription>
                    Modify pricing and features for this plan
                  </DialogDescription>
                </DialogHeader>
                <div className='space-y-6 py-4'>
                  {/* Basic Info */}
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label>Plan Name</Label>
                      <Input
                        value={editingPackage.name}
                        onChange={(e) =>
                          setEditingPackage({
                            ...editingPackage,
                            name: e.target.value
                          })
                        }
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label>Tier ID</Label>
                      <Input value={editingPackage.tier} disabled />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label>Description</Label>
                    <Textarea
                      value={editingPackage.description}
                      onChange={(e) =>
                        setEditingPackage({
                          ...editingPackage,
                          description: e.target.value
                        })
                      }
                    />
                  </div>

                  {/* Pricing */}
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label>Monthly Price ($)</Label>
                      <Input
                        type='number'
                        value={editingPackage.monthlyPrice}
                        onChange={(e) =>
                          setEditingPackage({
                            ...editingPackage,
                            monthlyPrice: parseInt(e.target.value) || 0
                          })
                        }
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label>Yearly Price ($)</Label>
                      <Input
                        type='number'
                        value={editingPackage.yearlyPrice}
                        onChange={(e) =>
                          setEditingPackage({
                            ...editingPackage,
                            yearlyPrice: parseInt(e.target.value) || 0
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Limits */}
                  <div className='grid grid-cols-3 gap-4'>
                    <div className='space-y-2'>
                      <Label>Max Students</Label>
                      <Input
                        type='number'
                        value={editingPackage.maxStudents}
                        onChange={(e) =>
                          setEditingPackage({
                            ...editingPackage,
                            maxStudents: parseInt(e.target.value) || 0
                          })
                        }
                      />
                      <p className='text-muted-foreground text-xs'>
                        Use -1 for unlimited
                      </p>
                    </div>
                    <div className='space-y-2'>
                      <Label>Max Teachers</Label>
                      <Input
                        type='number'
                        value={editingPackage.maxTeachers}
                        onChange={(e) =>
                          setEditingPackage({
                            ...editingPackage,
                            maxTeachers: parseInt(e.target.value) || 0
                          })
                        }
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label>Max Admins</Label>
                      <Input
                        type='number'
                        value={editingPackage.maxAdmins}
                        onChange={(e) =>
                          setEditingPackage({
                            ...editingPackage,
                            maxAdmins: parseInt(e.target.value) || 0
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Feature Toggles */}
                  <div className='space-y-4'>
                    <Label>Features</Label>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='flex items-center justify-between'>
                        <Label htmlFor='customBranding'>Custom Branding</Label>
                        <Switch
                          id='customBranding'
                          checked={editingPackage.customBranding}
                          onCheckedChange={(checked) =>
                            setEditingPackage({
                              ...editingPackage,
                              customBranding: checked
                            })
                          }
                        />
                      </div>
                      <div className='flex items-center justify-between'>
                        <Label htmlFor='apiAccess'>API Access</Label>
                        <Switch
                          id='apiAccess'
                          checked={editingPackage.apiAccess}
                          onCheckedChange={(checked) =>
                            setEditingPackage({
                              ...editingPackage,
                              apiAccess: checked
                            })
                          }
                        />
                      </div>
                      <div className='flex items-center justify-between'>
                        <Label htmlFor='dataExport'>Data Export</Label>
                        <Switch
                          id='dataExport'
                          checked={editingPackage.dataExport}
                          onCheckedChange={(checked) =>
                            setEditingPackage({
                              ...editingPackage,
                              dataExport: checked
                            })
                          }
                        />
                      </div>
                      <div className='flex items-center justify-between'>
                        <Label htmlFor='advancedAnalytics'>
                          Advanced Analytics
                        </Label>
                        <Switch
                          id='advancedAnalytics'
                          checked={editingPackage.advancedAnalytics}
                          onCheckedChange={(checked) =>
                            setEditingPackage({
                              ...editingPackage,
                              advancedAnalytics: checked
                            })
                          }
                        />
                      </div>
                      <div className='flex items-center justify-between'>
                        <Label htmlFor='whiteLabel'>White Label</Label>
                        <Switch
                          id='whiteLabel'
                          checked={editingPackage.whiteLabel}
                          onCheckedChange={(checked) =>
                            setEditingPackage({
                              ...editingPackage,
                              whiteLabel: checked
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Support Level */}
                  <div className='space-y-2'>
                    <Label>Support Level</Label>
                    <Select
                      value={editingPackage.supportLevel}
                      onValueChange={(value) =>
                        setEditingPackage({
                          ...editingPackage,
                          supportLevel: value as
                            | 'email'
                            | 'priority'
                            | 'dedicated'
                            | '24/7'
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='email'>
                          Email (48hr response)
                        </SelectItem>
                        <SelectItem value='priority'>
                          Priority (24hr response)
                        </SelectItem>
                        <SelectItem value='dedicated'>
                          Dedicated (4hr response)
                        </SelectItem>
                        <SelectItem value='24/7'>24/7 Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant='outline'
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSavePackage}>
                    <Save className='mr-2 h-4 w-4' />
                    Save Changes
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PageContainer>
  );
}
