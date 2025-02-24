require 'nokogiri'
require 'open-uri'
require 'faker'  # Use Faker to generate random user agents
require 'sequel'

# Simple web crawler to fetch Amazon product details (title and price)
class AmazonCrawler
  attr_accessor :visited_urls

  def initialize
    @visited_urls = []
  end

  # Fetch and parse the webpage content
  def crawl(url, keywords=false)
    return if @visited_urls.include?(url)

    puts "Crawling: #{url}"
    @visited_urls << url

    begin
      # Set the User-Agent to avoid being blocked
      headers = { 'User-Agent' => Faker::Internet.user_agent }

      # Open the URL and parse its HTML content
      html_content = URI.open(url, headers)  # Correct way to pass headers
      document = Nokogiri::HTML(html_content)

      document.css('.s-result-item').each do |item|
        if !keywords
          title = item.at_css('.a-size-base-plus') ? item.at_css('.a-size-base-plus').text.strip : nil
        else
          title = item.at_css('.a-size-medium') ? item.at_css('.a-size-medium').text.strip : nil
        end
        price_full = item.at_css('.a-offscreen') ? item.at_css('.a-offscreen').text.strip : nil
        link = item.at_css('.a-link-normal') ? "https://amazon.com#{item.at_css('.a-link-normal')['href']}" : nil

        if link
          link = "#{link.split('?')[0]}"
        end

        if title && price_full && link && link != "https://amazon.com/sspa/click"
          puts "Title: #{title}"
          puts "Price: #{price_full}"
          puts "Link: #{link}"

          product_page = URI.open(link, headers)
          product_document = Nokogiri::HTML(product_page)

          about_section = product_document.at_css('#feature-bullets')
          if about_section
            puts "About this item:"
            about_section.css('li').each do |feature|
              feature_text = feature.at_css('span.a-list-item') ? feature.at_css('span.a-list-item').text.strip : nil
              puts "- #{feature_text}" if feature_text
            end
          else
            puts "No 'About this item' section found"
          end

          puts "-" * 30
        end

      end

    rescue StandardError => e
      puts "Error crawling #{url}: #{e.message}"
    end
  end
end

# Create a new instance of AmazonCrawler and start crawling
crawler = AmazonCrawler.new

puts "Do you want to search using keywords? (Y/N)"
response = gets.chomp.downcase

# Replace with an Amazon search results URL or product URL
if response == "n"
  product_url = 'https://www.amazon.com/s?i=specialty-aps&bbn=16225007011&rh=n%3A16225007011%2Cn%3A13896617011&ref=nav_em__nav_desktop_sa_intl_computers_tablets_0_2_7_4'  # Example URL
  crawler.crawl(product_url)
else
  puts "Enter keywords to search for, divided by space:"
  keywords = gets.chomp.downcase.split.join('+')
  product_url = "https://www.amazon.com/s?k=#{keywords}"
  crawler.crawl(product_url, true)
end

