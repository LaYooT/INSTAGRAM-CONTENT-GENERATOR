
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// Approve or reject a user (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const adminUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Accès refusé. Administrateur requis." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { approve } = body; // true to approve, false to reject

    // Update user approval status
    const updatedUser = await prisma.user.update({
      where: { id: params.userId },
      data: {
        isApproved: approve,
        approvedAt: approve ? new Date() : null,
        approvedBy: approve ? adminUser.id : null,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        isApproved: updatedUser.isApproved,
      },
    });
  } catch (error) {
    console.error("Error approving user:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
