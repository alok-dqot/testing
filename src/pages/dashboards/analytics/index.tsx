// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
// import AnalyticsTable from 'src/views/dashboards/analytics/AnalyticsTable'
import AnalyticsWeeklyOverview from 'src/views/dashboards/analytics/AnalyticsWeeklyOverview'
import CardStatsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal'
import useAnalytic from 'src/features/analytics/analytics.service'
import { useEffect } from 'react'
import CCPlanCard from 'src/views/dashboards/analytics/CCPlanCard'
import { useRouter } from 'next/router'
import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'
import { Button, CardContent, Typography } from '@mui/material'

const AnalyticsDashboard = () => {

  const store = useAnalytic()


  useEffect(() => {

    const init = async () => {
      await store.get.list()
    }
    init()

  }, [])


  const router = useRouter()


  return (
    <ApexChartWrapper>

      <Grid container spacing={4} sx={{ my: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <CardStatsHorizontal title={"Total Hits"} stats={store?.analytic?.total as any} icon={undefined} trendNumber={''} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CardStatsHorizontal title={"Used Hits"} stats={store?.analytic?.total_hits as any} icon={undefined} trendNumber={''} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CardStatsHorizontal
            title={'Total Hits (Today)'} stats={store?.analytic?.today_total_hits as any} icon={undefined} trendNumber={''}
            color='secondary'
            trend={undefined}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CardStatsHorizontal
            title={'Remaining Hits '} stats={store?.analytic?.remaining_hits as any} icon={undefined} trendNumber={''}
            color='secondary'
            trend={undefined}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Card>


            <CardHeader title={'Current Plan '} />
            {store.analytic?.subscriptions?.length > 0 ? store.analytic?.subscriptions.map(subs => {
              return (
                <>
                  <CCPlanCard
                    plans={subs?.plan?.plans}
                    amount={subs?.plan?.amount}
                    start_at={subs?.start_at}
                    end_at={subs?.end_at}
                    plan_status={subs?.plan_status}
                    matches_access={subs?.plan?.matches_access}
                    period={subs?.plan?.period}
                  />

                </>
              )
            })
              :
              <Card>
                <CardContent>
                  <Grid container >

                    <Grid item xs={4}>
                      <Typography >
                        No Active Plan
                      </Typography>
                    </Grid>

                    <Button
                      sx={{ mb: 2 }}
                      variant='contained'
                      onClick={() => router.replace('/apps/plans/list/')}
                    >
                      Buy A Plan
                    </Button>
                  </Grid>
                </CardContent>
              </Card>

            }
          </Card>
        </Grid>

      </Grid>


      <Grid container spacing={6}>
        <Grid item xs={12} md={12} lg={12}>
          <AnalyticsWeeklyOverview />
        </Grid>

      </Grid>



    </ApexChartWrapper>
  )
}

AnalyticsDashboard.moduleId = 2
AnalyticsDashboard.gameIds = [1, 2]





export default AnalyticsDashboard





