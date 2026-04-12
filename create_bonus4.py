#!/usr/bin/env python3
"""
Create Bonus 4 PDF - Local Lead Gen Goldmine
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

def create_bonus4_pdf():
    pdf = BonusPDF()
    pdf.add_page()
    pdf.chapter_title('Bonus #4: The "Local Lead Gen Goldmine" Pack')
    pdf.chapter_subtitle('The Fastest Path to Your First Paying Client')
    
    pdf.body_text("Welcome to the goldmine. You are holding a complete franchise model for what is arguably the most reliable and beginner-friendly business to build with OpenClaw Cracked: Local Lead Generation.")
    
    pdf.body_text("Forget complex funnels and global competition. This model is simple: thousands of local business owners in your own backyard are experts at their craft but are terrible at marketing. They desperately need more customers, and they are willing to pay handsomely for them.")
    
    pdf.body_text("You are about to become their solution. Using this guide and OpenClaw, you will become a digital landlord. You will build simple online properties (lead-generating websites) that attract motivated customers, and then you will direct those customers to a local business for a monthly fee.")
    
    pdf.body_text("This pack contains your complete toolkit: the most profitable niches to target, the exact outreach emails that get replies, the script to close deals without being salesy, and the AI commands to automate the entire process.")
    
    pdf.set_font('helvetica', 'B', 12)
    pdf.set_text_color(13, 110, 253)
    pdf.multi_cell(0, 8, 'Your goal: Land your first paying client within the next 7 days.')
    pdf.ln(5)
    
    pdf.chapter_subtitle('Part 1: The "Beyond Plumbers" Niche List')
    pdf.body_text("The key to success is avoiding the crowded, red ocean markets where everyone is fighting. We are going to target blue ocean niches - high-value, underserved markets where you can quickly become the dominant player.")
    
    pdf.chapter_subtitle('Niche 1: Junk Removal Services')
    pdf.body_text("Why It is a Goldmine: Urgent, problem-aware customers. A single job can be worth $300-$1,000+. Business owners are often owner-operators who answer their own phones and are eager for more jobs.\n\nIdeal Client: The Truck and a Dream owner-operator. Practical, no-nonsense, and values results over fancy presentations.\n\nLead Value: $35 - $60 per qualified lead\n\nAI Keywords: Same-day junk removal in [city], appliance removal near me, estate cleanout services [city]")
    
    pdf.add_page()
    pdf.chapter_subtitle('Niche 2: Mobile Car Detailing')
    pdf.body_text("Why It is a Goldmine: High-ticket convenience service ($250-$500+ per vehicle). Clients are often busy professionals or luxury car owners who value their time more than money.\n\nIdeal Client: The Perfectionist Entrepreneur. They take pride in their work and appreciate a professional online presence.\n\nLead Value: $30 - $50 per qualified lead\n\nAI Keywords: Luxury mobile detailing [city], ceramic coating services near me, interior car cleaning [city]")
    
    pdf.chapter_subtitle('Niche 3: Gutter Cleaning')
    pdf.body_text("Why It is a Goldmine: Seasonal but incredibly urgent. Neglected gutters lead to thousands in water damage, making this a high-priority, easy-to-sell service.\n\nIdeal Client: The Practical Pro. Often a roofer or handyman who does gutters as a side business and would love to have the jobs scheduled for them.\n\nLead Value: $25 - $45 per qualified lead\n\nAI Keywords: Gutter cleaning service [city], gutter repair near me, downspout cleaning [city]")
    
    pdf.chapter_subtitle('Niche 4: Pool Cleaning Services')
    pdf.body_text("Why It is a Goldmine: Recurring revenue potential. Pool owners need weekly service and are often affluent homeowners who value reliability over price.\n\nIdeal Client: The Reliable Route Owner. They have multiple employees and are always looking to fill their schedule with new weekly accounts.\n\nLead Value: $40 - $80 per qualified lead\n\nAI Keywords: Weekly pool service [city], pool maintenance near me, pool cleaning company [city]")
    
    pdf.add_page()
    pdf.chapter_subtitle('Niche 5: Pressure Washing')
    pdf.body_text("Why It is a Goldmine: High-ticket residential and commercial jobs. Driveways, decks, and building exteriors command premium prices.\n\nIdeal Client: The Growth-Minded Operator. They have invested in professional equipment and are actively trying to scale their business.\n\nLead Value: $30 - $60 per qualified lead\n\nAI Keywords: House pressure washing [city], driveway cleaning service, commercial pressure washing [city]")
    
    pdf.chapter_subtitle('Niche 6: HVAC Services')
    pdf.body_text("Why It is a Goldmine: Emergency-driven, high-value leads. When AC breaks in summer or heat fails in winter, homeowners will pay anything for fast service.\n\nIdeal Client: The Established Company. They have multiple technicians and are hungry for consistent lead flow to keep their team busy.\n\nLead Value: $75 - $150 per qualified lead\n\nAI Keywords: Emergency AC repair [city], furnace repair near me, HVAC service [city]")
    
    pdf.chapter_subtitle('Niche 7: Carpet Cleaning')
    pdf.body_text("Why It is a Goldmine: High-frequency need (annual/bi-annual) and urgent situations (stains, move-outs). Good average ticket with upsell potential.\n\nIdeal Client: The Family-Owned Business. They have been around for years and rely on traditional marketing that is no longer working.\n\nLead Value: $25 - $45 per qualified lead\n\nAI Keywords: Same-day carpet cleaning [city], pet stain removal, move-out cleaning [city]")
    
    pdf.add_page()
    pdf.chapter_subtitle('Niche 8: Pest Control')
    pdf.body_text("Why It is a Goldmine: Recurring revenue model with urgent initial needs. Once you get a customer, they typically stay for years.\n\nIdeal Client: The Local Franchisee. They have corporate support but need local marketing help to compete with the big brands.\n\nLead Value: $50 - $100 per qualified lead\n\nAI Keywords: Pest control service [city], termite inspection near me, rodent removal [city]")
    
    pdf.chapter_subtitle('Niche 9: Landscaping')
    pdf.body_text("Why It is a Goldmine: Seasonal recurring revenue with high-ticket projects. Lawn maintenance leads to hardscaping, tree work, and design projects.\n\nIdeal Client: The Crew Leader. They have a team of workers and equipment but struggle with consistent new customer acquisition.\n\nLead Value: $35 - $65 per qualified lead\n\nAI Keywords: Landscaping services [city], lawn maintenance near me, tree trimming [city]")
    
    pdf.chapter_subtitle('Niche 10: Home Security Systems')
    pdf.body_text("Why It is a Goldmine: High-urgency, high-value leads. Recent break-ins or new homeowners are highly motivated buyers.\n\nIdeal Client: The Local Dealer. They represent major brands but need help competing against national advertising budgets.\n\nLead Value: $100 - $200 per qualified lead\n\nAI Keywords: Home security systems [city], alarm installation near me, security camera installation [city]")
    
    pdf.add_page()
    pdf.chapter_subtitle('Part 2: The Foot-in-the-Door Email Template')
    
    pdf.body_text("This is the exact email that gets opened, read, and replied to. It is not salesy. It is helpful and positions you as a problem-solver.")
    
    pdf.set_font('helvetica', 'I', 10)
    pdf.set_text_color(80, 80, 80)
    pdf.multi_cell(190, 5, 'Subject: Quick question about [Business Name]\n\nHi [Name],\n\nI was searching for [service] in [city] and came across your business. I noticed [specific observation about their current marketing].\n\nI help local [service] businesses get more customers through simple online strategies. Would you be open to a brief conversation about how I might help [Business Name] get more leads?\n\nNo obligation-just a quick chat to see if there is a fit.\n\nBest,\n[Your Name]\n[Your Phone]')
    pdf.ln(5)
    
    pdf.set_font('helvetica', '', 11)
    pdf.set_text_color(51, 51, 51)
    pdf.body_text("Why This Works:\n- Personalized subject line\n- Shows you did research\n- Positions you as helpful, not salesy\n- Low-pressure call to action\n- Short and respectful of their time")
    
    pdf.chapter_subtitle('Part 3: The Non-Salesy Close Script')
    
    pdf.body_text("When they reply and agree to a call, here is your simple 3-step process:")
    
    pdf.set_font('helvetica', 'B', 12)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 8, 'Step 1: The Discovery', new_x='LMARGIN', new_y='NEXT')
    pdf.set_font('helvetica', '', 11)
    pdf.set_text_color(51, 51, 51)
    pdf.multi_cell(0, 6, 'Ask these questions:\n- How do you currently get most of your customers?\n- What is your biggest challenge with getting new leads?\n- If you could wave a magic wand, how many new customers would you want per month?\n- What is a new customer worth to you on average?')
    pdf.ln(3)
    
    pdf.set_font('helvetica', 'B', 12)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 8, 'Step 2: The Presentation', new_x='LMARGIN', new_y='NEXT')
    pdf.set_font('helvetica', '', 11)
    pdf.set_text_color(51, 51, 51)
    pdf.multi_cell(0, 6, 'Say something like:\n"Based on what you have told me, I believe I can help you get [X] additional leads per month. I build simple websites that attract motivated customers looking for exactly what you offer. You only pay for qualified leads, so there is no risk."')
    pdf.ln(3)
    
    pdf.add_page()
    pdf.set_font('helvetica', 'B', 12)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 8, 'Step 3: The Close', new_x='LMARGIN', new_y='NEXT')
    pdf.set_font('helvetica', '', 11)
    pdf.set_text_color(51, 51, 51)
    pdf.multi_cell(0, 6, 'Ask:\n"Would you like to do a test run? I will build the lead system and send you 5 leads at no cost. If you like the quality, we can discuss a monthly arrangement. Fair enough?"\n\nThis risk-reversal approach makes it easy for them to say yes.')
    pdf.ln(5)
    
    pdf.chapter_subtitle('Part 4: AI Commands to Automate Everything')
    
    pdf.body_text("Use these prompts in OpenClaw to build your lead generation assets:")
    
    pdf.set_font('helvetica', 'B', 11)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 7, 'Build the Landing Page:', new_x='LMARGIN', new_y='NEXT')
    pdf.set_font('helvetica', 'I', 10)
    pdf.set_text_color(80, 80, 80)
    pdf.multi_cell(190, 5, '"Create a landing page for a [niche] business in [city]. The headline should address the urgent problem of [specific pain point]. Include a simple contact form with Name, Phone, and Service Needed. Add trust indicators and a clear call-to-action."')
    pdf.ln(3)
    
    pdf.set_font('helvetica', 'B', 11)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 7, 'Write SEO Content:', new_x='LMARGIN', new_y='NEXT')
    pdf.set_font('helvetica', 'I', 10)
    pdf.set_text_color(80, 80, 80)
    pdf.multi_cell(190, 5, '"Write a 500-word SEO article about [topic] for [city]. Include the keywords: [keyword 1], [keyword 2], [keyword 3]. The article should be helpful and end with a call-to-action to contact the business."')
    pdf.ln(3)
    
    pdf.set_font('helvetica', 'B', 11)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 7, 'Create Follow-up Emails:', new_x='LMARGIN', new_y='NEXT')
    pdf.set_font('helvetica', 'I', 10)
    pdf.set_text_color(80, 80, 80)
    pdf.multi_cell(190, 5, '"Write a 3-email follow-up sequence for leads who filled out a form but have not responded. Email 1 should be sent immediately, Email 2 after 24 hours, and Email 3 after 72 hours. Each email should provide value and encourage them to call."')
    pdf.ln(5)
    
    pdf.chapter_subtitle('Your 7-Day Action Plan')
    
    pdf.body_text("Day 1: Choose your niche from the list above\nDay 2: Research 20 local businesses in your chosen niche\nDay 3: Send 10 personalized outreach emails\nDay 4: Follow up with non-responders\nDay 5: Schedule calls with interested prospects\nDay 6: Present your solution and close your first client\nDay 7: Use OpenClaw to build their lead system")
    
    pdf.set_font('helvetica', 'B', 12)
    pdf.set_text_color(13, 110, 253)
    pdf.multi_cell(0, 8, 'Remember: Your first client is closer than you think. Take action today!')
    
    output_path = '/root/.openclaw/workspace/Bonus_4_Local_Lead_Gen_Goldmine.pdf'
    pdf.output(output_path)
    print(f'Created: {output_path}')
    return output_path

print("Creating Bonus 4 PDF...")
create_bonus4_pdf()
print("Done!")
