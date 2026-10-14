import type { ReactNode } from "react";
import { ArtifactWindow, ArtifactWindowBody } from "./components/artifact-window";
import { Badge } from "./components/badge";
import { Button } from "./components/button";
import { Card, CardDescription, CardHeader, CardTitle } from "./components/card";
import { DataCell, DataGrid } from "./components/data-cell";
import { EventFeed, EventRow } from "./components/event-row";
import { Input } from "./components/input";
import { IntegrationCard, IntegrationGrid } from "./components/integration-card";
import { Label } from "./components/label";
import { Panel, PanelActions, PanelFooter, PanelHeader, PanelTitle } from "./components/panel";
import { SpecMatrix, SpecRow } from "./components/spec-row";
import { StageBoard, StageCard, StageColumn } from "./components/stage-board";
import { StatusDot } from "./components/status-dot";
import { StepCard, StepGrid } from "./components/step-card";
import { Textarea } from "./components/textarea";
import { WorkSplit, WorkSplitPane } from "./components/work-split";
import { CtaBlock } from "./marketing/cta-block";
import { Container, Section, SectionHeading } from "./marketing/section";

const TOKENS = [
  { name: "ka-bg", swatch: "bg-ka-bg" },
  { name: "ka-surface", swatch: "bg-ka-surface" },
  { name: "ka-line", swatch: "bg-ka-line" },
  { name: "ka-ink", swatch: "bg-ka-ink" },
  { name: "ka-muted", swatch: "bg-ka-muted" },
  { name: "ka-accent", swatch: "bg-ka-accent" },
] as const;

function ShowcaseLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-3 font-mono text-[10px] tracking-wider text-ka-faint uppercase">{children}</h2>
  );
}

export function Showcase() {
  return (
    <>
      <Section>
        <Container size="md">
          <SectionHeading
            align="left"
            title="Component showcase"
            lede="Living style guide for the shared KA theme. Not linked from the site."
          />
        </Container>
      </Section>

      <Section>
        <Container size="md">
          <ShowcaseLabel>Tokens</ShowcaseLabel>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
            {TOKENS.map((token) => (
              <div
                key={token.name}
                className="overflow-hidden rounded-ka-card border border-ka-line bg-ka-surface"
              >
                <div className={`h-10 ${token.swatch}`} />
                <div className="px-1.5 py-1 font-mono text-[10px] text-ka-faint">{token.name}</div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container size="md">
          <ShowcaseLabel>Buttons</ShowcaseLabel>
          <div className="flex flex-wrap gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </Container>
      </Section>

      <Section>
        <Container size="md">
          <ShowcaseLabel>Badge</ShowcaseLabel>
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </Container>
      </Section>

      <Section>
        <Container size="md">
          <ShowcaseLabel>Card</ShowcaseLabel>
          <Card className="max-w-sm">
            <CardHeader>
              <CardTitle>Hairline card</CardTitle>
              <CardDescription>Mapped to ka surface and line tokens.</CardDescription>
            </CardHeader>
          </Card>
        </Container>
      </Section>

      <Section>
        <Container size="md">
          <ShowcaseLabel>Status dots</ShowcaseLabel>
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-ka-faint uppercase">
              <StatusDot /> Default
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-ka-faint uppercase">
              <StatusDot variant="success" /> Success
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-ka-faint uppercase">
              <StatusDot variant="danger" /> Danger
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-ka-faint uppercase">
              <StatusDot variant="neutral" /> Neutral
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-ka-faint uppercase">
              <StatusDot pulse /> Pulsing
            </span>
          </div>
        </Container>
      </Section>

      <Section>
        <Container size="md">
          <ShowcaseLabel>Target inspector</ShowcaseLabel>
          <Panel className="max-w-xl">
            <PanelHeader>
              <PanelTitle>
                <StatusDot pulse />
                Fleet <span className="text-ka-faint">/</span> Target{" "}
                <span className="text-ka-faint">/</span> MMSI 244670890
              </PanelTitle>
              <PanelActions>Live</PanelActions>
            </PanelHeader>
            <DataGrid cols={2} className="rounded-none border-x-0 border-t-0">
              <DataCell label="Run ID" value="run_8f3c21" />
              <DataCell
                label="Status"
                value="Live"
                hint="streaming"
                indicator={<StatusDot variant="success" size="sm" />}
              />
              <DataCell label="Duration" value="00:12:48" />
              <DataCell label="Tokens" value="14,302" hint="tok" />
            </DataGrid>
            <EventFeed className="rounded-none border-x-0" maxHeight="9.5rem">
              <EventRow
                timestamp="14:02:18"
                tag="Tool"
                message="browse_page"
                meta="128ms"
                indicator={<StatusDot size="sm" />}
              />
              <EventRow
                timestamp="14:02:41"
                tag="Run"
                message="tokens.delta +842"
                meta="+842"
                indicator={<StatusDot variant="success" size="sm" />}
              />
              <EventRow
                timestamp="14:03:02"
                tag="AIS"
                message="target.acquire MMSI 244670890"
                meta="02m ago"
                indicator={<StatusDot pulse size="sm" />}
              />
              <EventRow
                timestamp="14:03:11"
                tag="Run"
                message="tool.timeout browse_page"
                meta="1.2s"
                indicator={<StatusDot variant="danger" size="sm" />}
              />
            </EventFeed>
            <PanelFooter>4 events · 128ms p95 · 14.3k tokens</PanelFooter>
          </Panel>
        </Container>
      </Section>

      <Section>
        <Container size="md">
          <ShowcaseLabel>Integrations</ShowcaseLabel>
          <IntegrationGrid cols={2}>
            <IntegrationCard
              icon={
                <span className="font-mono text-[10px] font-medium tracking-wider uppercase">Gm</span>
              }
              name="Gmail & Workspace"
              status="OAuth 2.0"
              description="Inbox, Calendar, and Drive as live agent sources."
              action={
                <span className="font-mono text-[10px] tracking-wider text-ka-ink uppercase">
                  Connect
                </span>
              }
            />
            <IntegrationCard
              icon={
                <span className="font-mono text-[10px] font-medium tracking-wider uppercase">Sl</span>
              }
              name="Slack Bot"
              status="Active"
              description="Route alerts and accept /kilo commands in-channel."
              badge="Pre-configured"
            />
            <IntegrationCard
              icon={
                <span className="font-mono text-[10px] font-medium tracking-wider uppercase">Me</span>
              }
              name="Meta Ads Coordinator"
              status="OAuth 2.0"
              description="Coordinate campaign loops across ad accounts."
              badge="Pro"
            />
          </IntegrationGrid>
        </Container>
      </Section>

      <Section>
        <Container size="md">
          <ShowcaseLabel>Runtime specs</ShowcaseLabel>
          <SpecMatrix className="max-w-md">
            <SpecRow label="Execution memory" hint="isolate budget" value="512" unit="MB" />
            <SpecRow label="D1 State sync" hint="SQLite at the edge" value="Instant" />
            <SpecRow label="Concurrency cap" hint="soft limit" value="50" unit="tasks/hr" />
          </SpecMatrix>
        </Container>
      </Section>

      <Section>
        <Container size="md">
          <ShowcaseLabel>Autopilot steps</ShowcaseLabel>
          <StepGrid cols={3} className="max-md:grid-cols-1">
            <StepCard
              step={1}
              badge="Sources"
              title="Connect sources"
              description="Wire Gmail, Slack, and ads as inputs the loop can read."
            />
            <StepCard
              step={2}
              badge="Gates"
              title="Define loop gates"
              description="Set caps, approval pauses, and kill criteria before takeoff."
              visual={
                <pre className="overflow-hidden rounded-ka-card border border-ka-line bg-ka-bg px-2 py-1.5 font-mono text-[10px] text-ellipsis whitespace-nowrap text-ka-muted">
                  if tokens {">"} cap → pause
                </pre>
              }
            />
            <StepCard
              step={3}
              badge="Run"
              title="Run autopilot"
              description="Kilo executes, checkpoints state, and pages you on gates."
            />
          </StepGrid>
        </Container>
      </Section>

      <Section>
        <Container size="md">
          <ShowcaseLabel>Form</ShowcaseLabel>
          <div className="max-w-xs">
            <Label htmlFor="ui-name">Name</Label>
            <Input id="ui-name" placeholder="Ada Lovelace" />
            <div className="mt-3">
              <Label htmlFor="ui-note">Note</Label>
              <Textarea id="ui-note" placeholder="Short note" rows={3} />
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container size="lg">
          <ShowcaseLabel>Work split</ShowcaseLabel>
          <WorkSplit>
            <WorkSplitPane side="thread">
              <div className="border-b border-ka-line px-2.5 py-2">
                <div className="font-mono text-[10px] tracking-wider text-ka-ink uppercase">OPS</div>
                <div className="mt-0.5 text-xs text-ka-ink">Invoice tracker is in the room.</div>
              </div>
              <div className="border-b border-ka-line px-2.5 py-2">
                <div className="font-mono text-[10px] tracking-wider text-ka-ink uppercase">
                  AGENT
                </div>
                <div className="mt-0.5 text-xs text-ka-ink">
                  Built the board from the billing inbox.
                </div>
              </div>
              <div className="px-2.5 py-2">
                <div className="font-mono text-[10px] tracking-wider text-ka-ink uppercase">OPS</div>
                <div className="mt-0.5 text-xs text-ka-ink">Publish it.</div>
              </div>
            </WorkSplitPane>
            <WorkSplitPane side="artifact">
              <ArtifactWindow
                title="Talent pipeline"
                kind="APP"
                actions={<Button size="sm">Publish</Button>}
              >
                <ArtifactWindowBody>
                  <StageBoard className="p-2.5">
                    <StageColumn label="NEW">
                      <StageCard name="Ada Klein" meta="Engineer" />
                      <StageCard name="Jonah Peck" meta="Operator" />
                    </StageColumn>
                    <StageColumn label="SCREEN">
                      <StageCard name="Mira Chen" meta="Designer" />
                    </StageColumn>
                    <StageColumn label="INTERVIEW">
                      <StageCard name="Luis Ortega" meta="Lead" />
                    </StageColumn>
                  </StageBoard>
                  <DataGrid cols={4} className="rounded-none border-x-0 border-b-0">
                    <DataCell label="Applicants" value="42" hint="open" />
                    <DataCell label="Pipeline" value="486k" hint="usd" />
                    <DataCell label="Interviews" value="11" hint="this week" />
                    <DataCell label="Offers" value="7" hint="out" />
                  </DataGrid>
                </ArtifactWindowBody>
              </ArtifactWindow>
            </WorkSplitPane>
          </WorkSplit>
        </Container>
      </Section>

      <Section>
        <Container size="md">
          <ShowcaseLabel>CTA</ShowcaseLabel>
          <CtaBlock heading="Ready when you are" body="Shared marketing CTA block.">
            <div className="mt-6">
              <Button>Book a call</Button>
            </div>
          </CtaBlock>
        </Container>
      </Section>
    </>
  );
}
