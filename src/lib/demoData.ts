import { toast } from "sonner";
import { supabase } from "./supabaseClient";

export const initializeDemoData = async () => {
  try {
    // 1. Sign up demo user
    const { data: { user }, error: authError } = await supabase.auth.signUp({
      email: "demo@skilllink.app",
      password: "DemoPassword123",
      options: {
        data: {
          name: "Demo User"
        }
      }
    });

    if (authError) throw authError;

    // 2. Create demo profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: user?.id,
        name: "Demo User",
        location: "San Francisco, CA",
        bio: "I'm a demo user showcasing the SkillLink platform!",
        updated_at: new Date().toISOString()
      });

    if (profileError) throw profileError;

    // 3. Wait briefly to ensure profile is created
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 4. Create sample skill posts
    const demoPosts = [
      {
        title: "Watercolor Painting",
        description: "Beautiful watercolor landscapes and portraits.",
        category: "Art",
        user_id: user?.id,
      },
      {
        title: "Web Development",
        description: "Full-stack developer specializing in React.",
        category: "Coding",
        user_id: user?.id,
      }
    ];

    const { error: postsError } = await supabase
      .from('skill_posts')
      .insert(demoPosts);

    if (postsError) throw postsError;

    toast.success("Demo data initialized successfully!");
  } catch (error: any) {
    toast.error(`Failed to initialize demo data: ${error.message}`);
    console.error(error);
  }
};