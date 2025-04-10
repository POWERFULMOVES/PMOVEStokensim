import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { DEFAULT_PARAMS } from '@/lib/simulation';
import { ParameterInfo } from '@/components/ParameterInfo';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TooltipProvider } from '@/components/ui/tooltip';

// Define the form schema with realistic ranges
const formSchema = z.object({
  // Basic parameters
  NUM_MEMBERS: z.coerce.number().min(10).max(500)
    .refine(val => val >= 10, {
      message: "At least 10 members needed for meaningful results"
    }),
  SIMULATION_WEEKS: z.coerce.number().min(12).max(520)
    .refine(val => val >= 12, {
      message: "At least 12 weeks needed to observe trends"
    }),

  // Wealth distribution parameters
  INITIAL_WEALTH_MEAN_LOG: z.coerce.number().min(5).max(10)
    .refine(val => val >= 5 && val <= 10, {
      message: "Log mean should be between 5-10 (approx. $150-$22,000)"
    }),
  INITIAL_WEALTH_SIGMA_LOG: z.coerce.number().min(0.1).max(2.0)
    .refine(val => val >= 0.1 && val <= 2.0, {
      message: "Sigma should be between 0.1-2.0 (low to high inequality)"
    }),

  // Budget parameters
  WEEKLY_FOOD_BUDGET_AVG: z.coerce.number().min(20).max(500)
    .refine(val => val >= 20, {
      message: "Average food budget should be at least $20"
    }),
  WEEKLY_FOOD_BUDGET_STDDEV: z.coerce.number().min(1).max(200)
    .refine(val => val <= val * 0.75, {
      message: "Standard deviation should be reasonable compared to average"
    }),
  MIN_WEEKLY_BUDGET: z.coerce.number().min(5).max(100),

  // Income parameters
  WEEKLY_INCOME_AVG: z.coerce.number().min(50).max(2000)
    .refine(val => val >= 50, {
      message: "Average income should be at least $50 per week"
    }),
  WEEKLY_INCOME_STDDEV: z.coerce.number().min(5).max(1000)
    .refine(val => val <= val * 0.75, {
      message: "Standard deviation should be reasonable compared to average"
    }),
  MIN_WEEKLY_INCOME: z.coerce.number().min(0).max(500),

  // Cooperative model parameters
  GROUP_BUY_SAVINGS_PERCENT: z.coerce.number().min(0).max(0.5)
    .refine(val => val <= 0.5, {
      message: "Savings percentage should be realistic (max 50%)"
    }),
  LOCAL_PRODUCTION_SAVINGS_PERCENT: z.coerce.number().min(0).max(0.5)
    .refine(val => val <= 0.5, {
      message: "Savings percentage should be realistic (max 50%)"
    }),
  PERCENT_SPEND_INTERNAL_AVG: z.coerce.number().min(0).max(0.9)
    .refine(val => val <= 0.9, {
      message: "Internal spending should be realistic (max 90%)"
    }),
  PERCENT_SPEND_INTERNAL_STDDEV: z.coerce.number().min(0).max(0.3)
    .refine(val => val <= 0.3, {
      message: "Standard deviation should be between 0-0.3"
    }),

  // Token system parameters
  GROTOKEN_REWARD_PER_WEEK_AVG: z.coerce.number().min(0).max(100),
  GROTOKEN_REWARD_STDDEV: z.coerce.number().min(0).max(50),
  GROTOKEN_USD_VALUE: z.coerce.number().min(0).max(10)
    .refine(val => val <= 10, {
      message: "Token value should be realistic (max $10)"
    }),
  WEEKLY_COOP_FEE_B: z.coerce.number().min(0).max(50)
    .refine(val => val <= 50, {
      message: "Weekly fee should be reasonable (max $50)"
    }),
});

type FormValues = z.infer<typeof formSchema>;

interface SimulationFormProps {
  onSubmit: (values: FormValues) => void;
  isLoading: boolean;
}

export function SimulationForm({ onSubmit, isLoading }: SimulationFormProps) {
  const [activeTab, setActiveTab] = useState('basic');

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_PARAMS,
  });

  // Handle form submission
  function handleSubmit(values: FormValues) {
    onSubmit(values);
  }

  return (
    <TooltipProvider>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Simulation Parameters</CardTitle>
          <CardDescription>
            Configure the parameters for the economic simulation to compare traditional and cooperative economic models
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="economy">Economy</TabsTrigger>
                  <TabsTrigger value="cooperative">Cooperative</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="NUM_MEMBERS"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Number of Members
                            <ParameterInfo
                              title="Number of Members"
                              description="The total number of participants in the economic simulation. Each member has their own income, spending habits, and wealth."
                              impact="Higher numbers create more realistic distributions but may slow down the simulation."
                            />
                          </FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormDescription>
                            Total participants in the simulation (recommended: 50-200)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="SIMULATION_WEEKS"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Simulation Weeks
                            <ParameterInfo
                              title="Simulation Duration"
                              description="The number of weeks to run the simulation. Longer simulations show more long-term trends and effects."
                              impact="Longer simulations provide better insights into long-term economic patterns but take more time to process."
                            />
                          </FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormDescription>
                            Duration of the simulation (recommended: 52-156 weeks)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="INITIAL_WEALTH_MEAN_LOG"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Initial Wealth Mean (Log)
                            <ParameterInfo
                              title="Initial Wealth Distribution"
                              description="The mean of the log-normal distribution used to generate initial wealth values. This creates a realistic wealth distribution where most members have moderate wealth and a few have high wealth."
                              impact="Higher values increase the overall starting wealth of the community."
                            />
                          </FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} />
                          </FormControl>
                          <FormDescription>
                            Average initial wealth in log scale (default: ~$1000)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="INITIAL_WEALTH_SIGMA_LOG"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Initial Wealth Sigma (Log)
                            <ParameterInfo
                              title="Wealth Inequality Parameter"
                              description="The standard deviation of the log-normal distribution used for initial wealth. This controls how spread out the wealth is. A value of 0.1 creates nearly equal wealth, while 1.0 creates significant inequality with a few very wealthy members and many with modest wealth. Values above 1.5 create extreme inequality."
                              impact="Increasing this creates more extreme wealth differences between members. For reference: 0.1-0.3 = low inequality, 0.5-0.8 = moderate inequality, 1.0+ = high inequality."
                            />
                          </FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" min="0.1" max="2.0" {...field} />
                          </FormControl>
                          <FormDescription>
                            Wealth distribution spread (0.1=equal, 0.5=moderate, 1.0+=very unequal)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="economy" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="WEEKLY_FOOD_BUDGET_AVG"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Weekly Food Budget Average
                            <ParameterInfo
                              title="Food Budget"
                              description="The average amount each member spends on food weekly. This is the primary spending category in the simulation."
                              impact="Higher values increase spending and can affect wealth accumulation rates."
                            />
                          </FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} />
                          </FormControl>
                          <FormDescription>
                            Average weekly spending on food in dollars
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="WEEKLY_FOOD_BUDGET_STDDEV"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Food Budget Std Dev
                            <ParameterInfo
                              title="Food Budget Variation"
                              description="The standard deviation of food budgets across members. This controls how much variation exists in spending habits. For example, with an average of $100 and std dev of $25, about 68% of members will spend between $75-$125 weekly."
                              impact="Higher values create more economic diversity in the simulation. Keep this below 75% of the average for realistic results."
                            />
                          </FormLabel>
                          <FormControl>
                            <Input type="number" step="1" min="1" max="200" {...field} />
                          </FormControl>
                          <FormDescription>
                            Standard deviation of food budgets (recommended: 10-30% of average)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="MIN_WEEKLY_BUDGET"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Min Weekly Budget
                            <ParameterInfo
                              title="Minimum Food Budget"
                              description="The minimum amount any member will spend on food weekly, regardless of their random assignment."
                              impact="Higher values ensure basic needs are met for all members."
                            />
                          </FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} />
                          </FormControl>
                          <FormDescription>
                            Minimum weekly food budget in dollars
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="WEEKLY_INCOME_AVG"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Weekly Income Average
                            <ParameterInfo
                              title="Income Level"
                              description="The average weekly income for members in the simulation. Income is distributed normally around this value."
                              impact="Higher incomes lead to faster wealth accumulation and economic growth."
                            />
                          </FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} />
                          </FormControl>
                          <FormDescription>
                            Average weekly income in dollars
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="WEEKLY_INCOME_STDDEV"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Income Std Dev
                            <ParameterInfo
                              title="Income Inequality"
                              description="The standard deviation of weekly incomes across members. This controls income variation in the community. For example, with an average of $200 and std dev of $50, about 68% of members will earn between $150-$250 weekly."
                              impact="Higher values create more economic stratification in the community. Keep this below 75% of the average for realistic results."
                            />
                          </FormLabel>
                          <FormControl>
                            <Input type="number" step="5" min="5" max="1000" {...field} />
                          </FormControl>
                          <FormDescription>
                            Standard deviation of weekly incomes (recommended: 20-40% of average)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="MIN_WEEKLY_INCOME"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Min Weekly Income
                            <ParameterInfo
                              title="Minimum Income"
                              description="The minimum weekly income any member will receive, regardless of their random assignment."
                              impact="Higher values create a social safety net effect in the simulation."
                            />
                          </FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} />
                          </FormControl>
                          <FormDescription>
                            Minimum weekly income in dollars
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="cooperative" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="GROUP_BUY_SAVINGS_PERCENT"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Group Buy Savings %
                            <ParameterInfo
                              title="Cooperative Purchasing Power"
                              description="The percentage savings members get when buying food collectively in Scenario B. This represents bulk purchasing power."
                              impact="Higher values make the cooperative model more efficient and increase wealth retention."
                            />
                          </FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" min="0" max="1" {...field} />
                          </FormControl>
                          <FormDescription>
                            Savings from group purchasing (0-1 or 0-100%)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="LOCAL_PRODUCTION_SAVINGS_PERCENT"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Local Production Savings %
                            <ParameterInfo
                              title="Local Production Efficiency"
                              description="The percentage savings from locally produced food in Scenario B. This represents reduced transportation and middleman costs."
                              impact="Higher values make the cooperative model more self-sufficient and economically efficient."
                            />
                          </FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" min="0" max="1" {...field} />
                          </FormControl>
                          <FormDescription>
                            Savings from local production (0-1 or 0-100%)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="PERCENT_SPEND_INTERNAL_AVG"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Internal Spending % Average
                            <ParameterInfo
                              title="Community Spending Preference"
                              description="The average percentage of budget that members choose to spend within the community rather than externally. Higher values keep more money circulating in the local economy."
                              impact="Higher values significantly improve community economic resilience and wealth retention."
                            />
                          </FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" min="0" max="1" {...field} />
                          </FormControl>
                          <FormDescription>
                            Average % spent within community (0-1 or 0-100%)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="PERCENT_SPEND_INTERNAL_STDDEV"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Internal Spending Std Dev
                            <ParameterInfo
                              title="Spending Preference Variation"
                              description="The standard deviation of internal spending preferences across members. This controls how much members differ in their preference to spend within the community. For a normal distribution, this means about 68% of members will be within ±1 std dev of the average."
                              impact="Higher values create more realistic variation in community participation. For example, with an average of 0.6 (60%) and std dev of 0.2, most members will spend between 40-80% internally."
                            />
                          </FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" min="0" max="0.3" {...field} />
                          </FormControl>
                          <FormDescription>
                            Standard deviation of internal spending % (recommended: 0.05-0.2)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="GROTOKEN_REWARD_PER_WEEK_AVG"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            GroToken Reward Average
                            <ParameterInfo
                              title="Community Currency Rewards"
                              description="The average number of GroTokens (community currency) awarded to members weekly in Scenario B. These tokens have value within the community."
                              impact="Higher values provide additional wealth to community members in the cooperative model."
                            />
                          </FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} />
                          </FormControl>
                          <FormDescription>
                            Average weekly token rewards (tokens per week)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="GROTOKEN_REWARD_STDDEV"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            GroToken Reward Std Dev
                            <ParameterInfo
                              title="Token Reward Variation"
                              description="The standard deviation of GroToken rewards across members. This controls how evenly tokens are distributed. For a normal distribution, about 68% of members will receive within ±1 std dev of the average reward."
                              impact="Higher values create more diversity in token-based wealth. For example, with an average of 10 tokens and std dev of 3, most members will receive between 7-13 tokens weekly."
                            />
                          </FormLabel>
                          <FormControl>
                            <Input type="number" step="0.5" min="0" max="50" {...field} />
                          </FormControl>
                          <FormDescription>
                            Standard deviation of GroToken rewards (recommended: 20-40% of average)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="GROTOKEN_USD_VALUE"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            GroToken USD Value
                            <ParameterInfo
                              title="Community Currency Value"
                              description="The value of each GroToken in USD. This determines how much the community currency contributes to members' wealth."
                              impact="Higher values increase the effectiveness of the token system in building community wealth."
                            />
                          </FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} />
                          </FormControl>
                          <FormDescription>
                            Value of each token in USD ($ per token)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="WEEKLY_COOP_FEE_B"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Weekly Coop Fee
                            <ParameterInfo
                              title="Cooperative Membership Fee"
                              description="The weekly fee paid by members to maintain the cooperative infrastructure in Scenario B. This represents the cost of running the cooperative system."
                              impact="Higher fees reduce individual wealth but may be offset by the benefits of the cooperative model."
                            />
                          </FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} />
                          </FormControl>
                          <FormDescription>
                            Weekly fee for cooperative membership in dollars
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Running Simulation...' : 'Run Simulation'}
              </Button>

              <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800 border border-blue-200">
                <p className="font-medium mb-1">About the Simulation</p>
                <p className="text-xs mb-2">This simulation compares two economic scenarios:</p>
                <ul className="text-xs list-disc list-inside space-y-1">
                  <li><span className="font-medium">Scenario A (Traditional):</span> Standard economic model with individual purchasing</li>
                  <li><span className="font-medium">Scenario B (Cooperative):</span> Community-based model with group purchasing, local production, and community currency</li>
                </ul>
                <div className="mt-2 pt-2 border-t border-blue-200">
                  <p className="text-xs font-medium mb-1">Understanding Standard Deviation</p>
                  <p className="text-xs">Standard deviation controls variation in a population. For a normal distribution:</p>
                  <ul className="text-xs list-disc list-inside">
                    <li>~68% of values fall within ±1 standard deviation of the mean</li>
                    <li>~95% of values fall within ±2 standard deviations</li>
                    <li>Higher standard deviation = more variation between members</li>
                  </ul>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
