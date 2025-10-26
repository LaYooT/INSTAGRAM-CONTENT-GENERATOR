

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/budget
 * Get user's budget information
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's manual budget
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { manualBudget: true }
    });

    // Get total cost from all jobs
    const jobs = await prisma.contentJob.findMany({
      where: { userId: session.user.id },
      select: { cost: true }
    });

    const totalSpent = jobs.reduce((sum, job) => sum + (job.cost || 0), 0);
    const manualBudget = user?.manualBudget || null;
    
    // Calculate remaining budget
    const remaining = manualBudget !== null ? manualBudget - totalSpent : null;

    return NextResponse.json({
      manualBudget,
      spent: totalSpent,
      remaining,
      hasManualBudget: manualBudget !== null
    });

  } catch (error) {
    console.error('Failed to fetch budget:', error);
    return NextResponse.json(
      { error: "Failed to fetch budget" }, 
      { status: 500 }
    );
  }
}

/**
 * POST /api/budget
 * Update user's manual budget
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { budget } = body;

    // Validate budget
    if (budget === null || budget === undefined) {
      // Remove manual budget
      await prisma.user.update({
        where: { id: session.user.id },
        data: { manualBudget: null }
      });

      return NextResponse.json({ 
        success: true, 
        message: "Budget removed successfully" 
      });
    }

    const budgetNum = parseFloat(budget);
    
    if (isNaN(budgetNum) || budgetNum < 0) {
      return NextResponse.json(
        { error: "Invalid budget amount" }, 
        { status: 400 }
      );
    }

    // Update user's manual budget
    await prisma.user.update({
      where: { id: session.user.id },
      data: { manualBudget: budgetNum }
    });

    return NextResponse.json({ 
      success: true, 
      manualBudget: budgetNum,
      message: "Budget updated successfully" 
    });

  } catch (error) {
    console.error('Failed to update budget:', error);
    return NextResponse.json(
      { error: "Failed to update budget" }, 
      { status: 500 }
    );
  }
}
