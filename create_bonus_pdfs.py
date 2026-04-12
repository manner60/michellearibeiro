#!/usr/bin/env python3
"""
Convert extracted text to formatted PDFs
"""

from fpdf import FPDF
import os

class BonusPDF(FPDF):
    def header(self):
        self.set_font('helvetica', 'B', 12)
        self.set_text_color(13, 110, 253)
        self.cell(0, 10, 'OpenClaw Cracked Exclusive Bonus', align='C')
        self.ln(15)
        
    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'Page {self.page_no()}', align='C')
        
    def chapter_title(self, title):
        self.set_font('helvetica', 'B', 18)
        self.set_text_color(0, 0, 0)
        self.multi_cell(0, 10, title)
        self.ln(5)
        
    def chapter_subtitle(self, subtitle):
        self.set_font('helvetica', 'B', 14)
        self.set_text_color(13, 110, 253)
        self.multi_cell(0, 8, subtitle)
        self.ln(3)
        
    def body_text(self, text):
        self.set_font('helvetica', '', 11)
        self.set_text_color(51, 51, 51)
        self.multi_cell(0, 6, text)
        self.ln(5)

def create_bonus1_pdf():
    pdf = BonusPDF()
    pdf.add_page()
    pdf.chapter_title('Bonus #1: The "AI Business-in-a-Box" Launch Kit')
    pdf.chapter_subtitle('Your Instant Business Launchpad')
    
    pdf.body_text("Congratulations on securing your access to OpenClaw Cracked! You have just equipped yourself with one of the most powerful AI execution engines on the planet.")
    
    pdf.body_text("While others are still just prompting, you are about to start deploying. The purpose of this Launch Kit is to give you the exact blueprints for your new AI-powered empire.")
    
    pdf.body_text("Think of OpenClaw as the master builder and these templates as the architectural plans for proven, profitable online businesses. We have analyzed the models from the sales page and reverse-engineered the core components you need to launch FAST.")
    
    pdf.chapter_subtitle('Your 3-Step Path to Instant Deployment')
    
    pdf.set_font('helvetica', '', 11)
    pdf.set_text_color(51, 51, 51)
    pdf.multi_cell(0, 6, "1. Choose Your Model: Browse the five templates and select the business you want to launch first.")
    pdf.ln(2)
    pdf.multi_cell(0, 6, "2. Copy the Blueprint: Copy the entire text content for the template page and the corresponding AI Command Prompt.")
    pdf.ln(2)
    pdf.multi_cell(0, 6, "3. Deploy with OpenClaw: Paste the content and prompts into OpenClaw's modules. Watch as your AI agent builds your business asset in minutes.")
    pdf.ln(5)
    
    pdf.chapter_subtitle('Template 1: The Local Lead Gen Client Catcher')
    
    pdf.body_text("Goal: This template is engineered for one specific purpose: to turn a local visitor, searching for an urgent service, into a high-value lead for a local business.")
    
    pdf.body_text("Strategy: The design is simple, direct, and mobile-first. When someone's basement is flooding, they don't care about fancy graphics; they care about finding a reliable expert FAST.")
    
    pdf.body_text("Key Elements:\n- Headline that speaks to the urgent problem\n- Trust indicators (reviews, years in business)\n- Simple contact form (Name, Phone, Issue)\n- Clear call-to-action button")
    
    pdf.set_font('helvetica', 'I', 10)
    pdf.set_text_color(80, 80, 80)
    pdf.multi_cell(190, 5, 'AI Prompt: "Create a landing page for a local [service] business in [city]. The headline should address the urgent problem of [specific pain point]. Include trust indicators and a simple contact form."')
    pdf.ln(5)
    
    pdf.add_page()
    pdf.chapter_subtitle('Template 2: The Digital Product Sales Page')
    
    pdf.body_text("Goal: Sell digital products (ebooks, courses, templates) with a high-converting sales page.")
    
    pdf.body_text("Key Elements:\n- Compelling headline with benefit\n- Story that connects with the reader\n- Bullet points of what is included\n- Price and guarantee\n- Strong call-to-action")
    
    pdf.set_font('helvetica', 'I', 10)
    pdf.set_text_color(80, 80, 80)
    pdf.multi_cell(190, 5, 'AI Prompt: "Write a sales page for a digital product about [topic]. The target audience is [specific audience]. Include a compelling story, benefits, and a strong guarantee."')
    pdf.ln(5)
    
    pdf.chapter_subtitle('Template 3: The Freelance Service Landing Page')
    
    pdf.body_text("Goal: Position yourself as a premium freelancer and attract high-value clients.")
    
    pdf.body_text("Key Elements:\n- Professional positioning statement\n- Portfolio/examples of work\n- Client testimonials\n- Clear service offerings\n- Contact/CTA section")
    
    pdf.set_font('helvetica', 'I', 10)
    pdf.set_text_color(80, 80, 80)
    pdf.multi_cell(190, 5, 'AI Prompt: "Create a professional landing page for a freelancer offering [service]. Position me as an expert in [niche]. Include sections for portfolio, testimonials, and services."')
    
    output_path = '/root/.openclaw/workspace/Bonus_1_AI_Business_Launch_Kit.pdf'
    pdf.output(output_path)
    print(f'Created: {output_path}')
    return output_path

def create_bonus3_pdf():
    pdf = BonusPDF()
    pdf.add_page()
    pdf.chapter_title('Bonus #3: The "AI Traffic Tsunami" Checklist')
    pdf.chapter_subtitle('Automating Your Audience Growth')
    
    pdf.body_text("A business without traffic is a secret. OpenClaw promises to flood your business with buyers, and this checklist is your step-by-step guide to making that happen.")
    
    pdf.body_text("Follow these steps to command your AI to set up and automate multiple streams of free, targeted traffic to any website or offer.")
    
    pdf.chapter_subtitle('Phase 1: Foundational SEO (Set it and Forget it)')
    
    pdf.set_font('helvetica', 'B', 12)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 8, 'Keyword Discovery', new_x='LMARGIN', new_y='NEXT')
    pdf.set_font('helvetica', '', 11)
    pdf.set_text_color(51, 51, 51)
    pdf.multi_cell(0, 6, 'Action: Use AI to find profitable keywords')
    pdf.set_font('helvetica', 'I', 10)
    pdf.set_text_color(80, 80, 80)
    pdf.multi_cell(190, 5, 'Prompt: "Act as an SEO expert. Generate a list of 20 long-tail keywords for a blog about [your niche]. Group them by user intent."')
    pdf.ln(5)
    
    pdf.set_font('helvetica', 'B', 12)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 8, 'On-Page SEO', new_x='LMARGIN', new_y='NEXT')
    pdf.set_font('helvetica', '', 11)
    pdf.set_text_color(51, 51, 51)
    pdf.multi_cell(0, 6, 'Action: Optimize your pages for search engines')
    pdf.set_font('helvetica', 'I', 10)
    pdf.set_text_color(80, 80, 80)
    pdf.multi_cell(190, 5, 'Prompt: "Optimize this text for the keyword [your keyword]. Write an SEO title (under 60 chars) and meta description (under 160 chars)."')
    pdf.ln(5)
    
    pdf.chapter_subtitle('Phase 2: Social Media Automation')
    
    pdf.set_font('helvetica', 'B', 12)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 8, 'Profile Optimization', new_x='LMARGIN', new_y='NEXT')
    pdf.set_font('helvetica', '', 11)
    pdf.set_text_color(51, 51, 51)
    pdf.multi_cell(0, 6, 'Action: Create compelling bios for your profiles')
    pdf.set_font('helvetica', 'I', 10)
    pdf.set_text_color(80, 80, 80)
    pdf.multi_cell(190, 5, 'Prompt: "Write a compelling bio for a [platform] profile for a brand in [your niche]. Include a clear call to action."')
    pdf.ln(5)
    
    pdf.set_font('helvetica', 'B', 12)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 8, 'Content Repurposing', new_x='LMARGIN', new_y='NEXT')
    pdf.set_font('helvetica', '', 11)
    pdf.set_text_color(51, 51, 51)
    pdf.multi_cell(0, 6, 'Action: Transform blog posts into social content')
    pdf.set_font('helvetica', 'I', 10)
    pdf.set_text_color(80, 80, 80)
    pdf.multi_cell(190, 5, 'Prompt: "Transform this blog post into 5 tweets, 1 Facebook post, and 1 LinkedIn article. Adapt the tone for each platform."')
    pdf.ln(5)
    
    pdf.add_page()
    pdf.chapter_subtitle('Phase 3: Video Marketing')
    
    pdf.body_text("YouTube and video content are powerful traffic drivers. Use AI to script engaging videos, create compelling titles, write SEO-optimized descriptions, and generate relevant tags.")
    
    pdf.set_font('helvetica', 'I', 10)
    pdf.set_text_color(80, 80, 80)
    pdf.multi_cell(190, 5, 'Prompt: "Write a YouTube video script about [topic]. The video should be 5-7 minutes. Include an engaging hook, 3 main points, and a strong call-to-action."')
    pdf.ln(5)
    
    pdf.chapter_subtitle('Phase 4: Email Marketing Automation')
    
    pdf.body_text("Build and nurture your email list with AI-powered sequences. Create lead magnets, welcome sequences, nurture campaigns, and promotional broadcasts.")
    
    pdf.set_font('helvetica', 'I', 10)
    pdf.set_text_color(80, 80, 80)
    pdf.multi_cell(190, 5, 'Prompt: "Write a 5-email welcome sequence for new subscribers interested in [topic]. Email 1 delivers the lead magnet. Emails 2-4 provide value. Email 5 makes a soft pitch."')
    
    output_path = '/root/.openclaw/workspace/Bonus_3_AI_Traffic_Tsunami.pdf'
    pdf.output(output_path)
    print(f'Created: {output_path}')
    return output_path

def create_bonus5_pdf():
    pdf = BonusPDF()
    pdf.add_page()
    pdf.chapter_title('Bonus #5: The "Freelance Arbitrage Accelerator"')
    pdf.chapter_subtitle('The "Profit in the Middle" Model')
    
    pdf.body_text("Welcome to one of the most powerful business models you can run with AI. Freelance Arbitrage is the art of winning high-value projects and then using a more efficient resource to fulfill the work, allowing you to profit from the difference.")
    
    pdf.body_text("Think of yourself as a savvy digital project manager. A client pays you $750 for high-converting social media ads. You then use OpenClaw Cracked to generate those world-class ads in minutes. The client gets amazing results, and you capture a massive profit margin.")
    
    pdf.chapter_subtitle('The 3-Step System')
    
    pdf.set_font('helvetica', '', 11)
    pdf.set_text_color(51, 51, 51)
    pdf.multi_cell(0, 6, "1. POSITION as a premium, in-demand expert")
    pdf.ln(2)
    pdf.multi_cell(0, 6, "2. ACQUIRE high-paying clients who value results")
    pdf.ln(2)
    pdf.multi_cell(0, 6, "3. FULFILL the work instantly using AI")
    pdf.ln(5)
    
    pdf.chapter_subtitle('Part 1: The "Premium Agency" Profile Setup')
    
    pdf.body_text("Your #1 goal on platforms like Upwork and Fiverr is to look like a high-end agency, not a cheap freelancer. This positioning allows you to command premium prices from day one.")
    
    pdf.body_text("Your Profile Picture:\n- Use a clean, professional headshot where you are smiling\n- Good lighting is non-negotiable\n- Alternative: Create a clean logo for your agency")
    
    pdf.body_text("Your Title/Tagline:\nThis is the first thing a potential client reads. It must scream specialist, not generalist.")
    
    pdf.body_text("BAD Examples:\n- Content Writer\n- Virtual Assistant\n- Social Media Manager")
    
    pdf.body_text("GOOD Examples:\n- AI-Powered Direct Response Copywriter for E-commerce Brands\n- Conversion-Focused Email Strategist for SaaS Companies\n- Automated Funnel Architect for Coaches & Consultants")
    
    pdf.add_page()
    pdf.chapter_subtitle('Part 2: Winning High-Value Projects')
    
    pdf.body_text("The key to winning on these platforms is your proposal. Most freelancers send generic messages. You will use AI to craft personalized, compelling proposals.")
    
    pdf.body_text("The AI Proposal Formula:\n1. Acknowledge their specific problem\n2. Show you have the exact solution\n3. Provide social proof or relevant experience\n4. Include a clear next step")
    
    pdf.set_font('helvetica', 'I', 10)
    pdf.set_text_color(80, 80, 80)
    pdf.multi_cell(190, 5, 'Prompt: "Write a proposal for an Upwork job. The client needs [specific service]. They mentioned [specific detail]. Position me as an expert. Keep it concise but compelling."')
    pdf.ln(5)
    
    pdf.set_font('helvetica', '', 11)
    pdf.set_text_color(51, 51, 51)
    pdf.body_text("Proposal Tips:\n- Personalize every proposal\n- Lead with value, not credentials\n- Include relevant examples\n- End with a question\n- Keep it under 200 words")
    
    pdf.chapter_subtitle('Part 3: AI-Powered Fulfillment')
    
    pdf.body_text("Once you win the project, it is time to deliver. Here is where OpenClaw becomes your secret weapon.")
    
    pdf.body_text("For Copywriting Projects:\n- Use the Conversion Copywriter module\n- Input client requirements\n- Generate multiple variations\n- Deliver polished work in minutes")
    
    pdf.body_text("For Design Projects:\n- Use the Revenue Page Architect\n- Create landing pages and sales pages\n- Export and deliver to client")
    
    pdf.body_text("For Content Projects:\n- Use the Blog & Article Writer\n- Generate SEO-optimized content\n- Edit and polish with AI assistance")
    
    pdf.body_text("Remember: Your goal is to deliver exceptional results faster than any human freelancer could. This is your competitive advantage.")
    
    pdf.chapter_subtitle('Pricing Strategy')
    
    pdf.body_text("- Charge 2-3x what you would as a regular freelancer\n- Your speed and quality justify premium prices\n- Position AI as your proprietary system\n- Never reveal you are using AI (unless asked)")
    
    pdf.chapter_subtitle('Scaling Your Arbitrage Business')
    
    pdf.body_text("1. Start with one service you know well\n2. Master the AI prompts for that service\n3. Build a portfolio of successful projects\n4. Gradually add complementary services\n5. Eventually hire human editors to review AI output\n6. Scale to multiple clients and services")
    
    output_path = '/root/.openclaw/workspace/Bonus_5_Freelance_Arbitrage_Accelerator.pdf'
    pdf.output(output_path)
    print(f'Created: {output_path}')
    return output_path

# Create all PDFs
print("Creating professional PDFs...\n")
create_bonus1_pdf()
create_bonus3_pdf()
create_bonus5_pdf()
print("\nAll PDFs created successfully!")
