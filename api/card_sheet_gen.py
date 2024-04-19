import urllib.request
from io import BytesIO
from PIL import Image
from tempfile import NamedTemporaryFile
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

def generate_card_sheet(image_links, deck_name, os):
    # Card dimensions in inches
    card_width = 3.5
    card_height = 2.5
    output_pdf_path = deck_name + ".pdf"
    # PDF canvas dimensions
    pdf_width, pdf_height = letter

    # Calculate the number of rows and columns based on the card size
    num_rows = int(pdf_height // card_height)
    num_columns = int(pdf_width // card_width)

    # Calculate the total number of cards that can fit on a page
    cards_per_page = num_rows * num_columns

    # Initialize PDF canvas
    pdf_canvas = canvas.Canvas(output_pdf_path, pagesize=letter)

    # Iterate through image links and position them on the PDF canvas
    for index, image_link in enumerate(image_links):
        # Calculate page and position on the page
        page_num = index // cards_per_page
        row_in_page = (index % cards_per_page) // num_columns
        col_in_page = (index % cards_per_page) % num_columns
        # Calculate position on PDF canvas
        x_position = col_in_page * card_width
        y_position = (num_rows - row_in_page - 1) * card_height  # Invert the row for proper placement

        # Add a new page if needed
        if index % cards_per_page == 0:
            pdf_canvas.showPage()

        # Download image from the link
        print("Downloading image")
        with urllib.request.urlopen(image_link) as response:
            img_data = response.read()

        # Save the image to a temporary file
        with NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            temp_file.write(img_data)
            temp_file_path = temp_file.name

        # Open the image using PIL
        img = Image.open(temp_file_path)

        # Draw the image on the PDF canvas
        pdf_canvas.drawInlineImage(img, x_position, y_position, width=card_width, height=card_height)

        # Delete the temporary file
        temp_file.close()
        os.unlink(temp_file_path)

    # Save the last page
    pdf_canvas.save()
