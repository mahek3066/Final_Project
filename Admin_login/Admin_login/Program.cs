var builder = WebApplication.CreateBuilder(args);

// =======================
// READ GMAIL APP PASSWORD
// =======================
builder.Configuration["EmailSettings:AppPassword"] =
    Environment.GetEnvironmentVariable("GMAIL_APP_PASSWORD");

// =======================
// ADD SERVICES
// =======================
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS policy for frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy.WithOrigins("http://localhost:3000") // your frontend
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

// =======================
// BUILD APP
// =======================
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Use HTTPS redirection
app.UseHttpsRedirection();

// Use CORS (before authorization)
app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();