#!/usr/bin/env python3
"""
Create complete Bonus 1 PDF with all 5 templates
"""

from fpdf import FPDF

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

def create_bonus1_complete():
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
    pdf.multi_cell(0, 6, "1. Choose Your Model: Browse the five templates below and select the business you want to launch first.")
    pdf.ln(2)
    pdf.multi_cell(0, 6, "2. Copy the Blueprint: Copy the entire text content for the template page and the corresponding AI Command Prompt.")
    pdf.ln(2)
    pdf.multi_cell(0, 6, "3. Deploy with OpenClaw: Paste the content and prompts into OpenClaw's modules. Watch as your AI agent builds your business asset in minutes.")
    pdf.ln(5)
    
    # TEMPLATE 1
    pdf.chapter_subtitle('Template 1: Local Lead Gen "Client Catcher"')
    pdf.body_text("Goal: Turn a local visitor searching for urgent service into a high-value lead for a local business. Perfect for generating recurring monthly income.")
    pdf.body_text("Strategy: Simple, direct, mobile-first design. When someone's basement is flooding, they care about finding a reliable expert FAST.")
    pdf.body_text("Key Elements:\n- Headline addressing urgent problem\n- Trust indicators (reviews, years in business)\n- Simple contact form\n- Clear call-to-action")
    pdf.set_font('helvetica', 'I', 10)
    pdf.set_text_color(80, 80, 80)
    pdf.multi_cell(190, 5, 'AI Prompt: "Create a landing page for a local [service] business in [city]. The headline should address the urgent problem of [specific pain point]. Include trust indicators and a simple contact form with Name, Phone, and Service Needed."')
    pdf.ln(5)
    
    # TEMPLATE 2
    pdf.add_page()
    pdf.chapter_subtitle('Template 2: Digital Product Profits Sales Page')
    pdf.body_text("Goal: Sell any digital product from a $17 ebook to a $297 course. Based on the timeless Problem-Agitate-Solve formula used by top marketers.")
    pdf.body_text("Strategy: Takes visitor on emotional journey. Connects with frustrations, intensifies need for solution, then presents your product as the answer.")
    pdf.body_text("Key Elements:\n- Compelling headline with benefit\n- Story that agitates the problem\n- Bullet points of what is included\n- Price and guarantee\n- Strong call-to-action")
    pdf.set_font('helvetica', 'I', 10)
    pdf.set_text_color(80, 80, 80)
    pdf.multi_cell(190, 5, 'AI Prompt: "Write a sales page for a digital product about [topic]. Use the Problem-Agitate-Solve framework. The target audience is [specific audience]. Include a compelling story, benefits, price, guarantee, and strong call-to-action."')
    pdf.ln(5)
    
    # TEMPLATE 3
    pdf.chapter_subtitle('Template 3: Freelance Arbitrage Service Showcase')
    pdf.body_text("Goal: Create a professional one-page website that positions you as a premium agency, not a low-cost freelancer. Charge higher prices for services fulfilled by OpenClaw.")
    pdf.body_text("Strategy: Perception is reality. Build trust and justify pricing with clear process, tiered packages, and FAQ section.")
    pdf.body_text("Key Elements:\n- Professional positioning statement\n- Portfolio/examples section\n- 3 tiered pricing packages\n- Process explanation\n- FAQ section\n- Contact/CTA")
    pdf.set_font('helvetica', 'I', 10)
    pdf.set_text_color(80, 80, 80)
    pdf.multi_cell(190, 5, 'AI Prompt: "Create a professional service page for a [service] agency. Position as premium provider for [niche]. Include 3 pricing tiers (Basic, Pro, Enterprise), process section, FAQ, and contact form."')
    pdf.ln(5)
    
    # TEMPLATE 4
    pdf.add_page()
    pdf.chapter_subtitle('Template 4: AI-Powered Content Social Media Management')
    pdf.body_text("Goal: Sell done-for-you social media management to busy local business owners. Focus on outcomes: saving time, looking professional, getting customers.")
    pdf.body_text("Strategy: Local business owners are experts in their trade, not social media. Position your service as the easy, affordable solution they have been looking for.")
    pdf.body_text("Key Elements:\n- Problem-focused headline\n- Before/after scenario\n- Service breakdown\n- Monthly pricing\n- Results guarantee\n- Easy signup process")
    pdf.set_font('helvetica', 'I', 10)
    pdf.set_text_color(80, 80, 80)
    pdf.multi_cell(190, 5, 'AI Prompt: "Create a landing page selling social media management services to [type of business] owners. Focus on saving them time and getting more customers. Include monthly pricing and guarantee section."')
    pdf.ln(5)
    
    # TEMPLATE 5
    pdf.chapter_subtitle('Template 5: Print-on-Demand Niche Storefront')
    pdf.body_text("Goal: Simple, clean landing page to sell Print-on-Demand products to passionate niche audience. Create emotional connection.")
    pdf.body_text("Strategy: Do not try to be Amazon. Niche down. Focus on showcasing a few killer designs to a very specific group (dog lovers, fantasy fans, etc.).")
    pdf.body_text("Key Elements:\n- Niche-specific headline\n- Hero product showcase\n- Emotional connection copy\n- Product gallery\n- Limited edition urgency\n- Simple checkout")
    pdf.set_font('helvetica', 'I', 10)
    pdf.set_text_color(80, 80, 80)
    pdf.multi_cell(190, 5, 'AI Prompt: "Create a storefront landing page for [niche] themed print-on-demand products (t-shirts, mugs, posters). Focus on emotional connection with [niche] enthusiasts. Include product showcase and urgency elements."')
    pdf.ln(5)
    
    pdf.chapter_subtitle('Quick Start Action Plan')
    pdf.body_text("Day 1: Choose your template and niche\nDay 2: Customize the AI prompts with your specifics\nDay 3: Generate your page with OpenClaw\nDay 4: Review and refine\nDay 5: Launch and start driving traffic\nDay 6-7: Optimize based on initial results")
    
    pdf.set_font('helvetica', 'B', 12)
    pdf.set_text_color(13, 110, 253)
    pdf.multi_cell(0, 8, 'Remember: The best template is the one you actually use. Pick one and launch today!')
    
    output_path = '/root/.openclaw/workspace/Bonus_1_AI_Business_Launch_Kit_COMPLETE.pdf'
    pdf.output(output_path)
    print(f'Created: {output_path}')
    return output_path

print("Creating complete Bonus 1 with all 5 templates...")
create_bonus1_complete()
print("Done!")
